from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
import uuid
from werkzeug.utils import secure_filename
from models import db, Agent, AgentData, User
from rpg_system import calculate_stats, calculate_rank, ACTIVITY_RULES
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database Config
# Database Config
database_url = os.getenv('DATABASE_URL')
if database_url and database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url or 'sqlite:///local.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'static/uploads'

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

db.init_app(app)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Save to backend static folder
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        # Return URL (assuming we serve static files or proxy them)
        return jsonify({"url": f"http://localhost:5001/static/uploads/{filename}"})
    return jsonify({"error": "File type not allowed"}), 400

@app.route('/api/agents', methods=['GET'])
def get_agents():
    agents = Agent.query.all()
    return jsonify([{
        "id": agent.id,
        "codename": agent.codename,
        "name": agent.name,
        "role": agent.role,
        "rank": agent.rank,
        "avatar": agent.avatar
    } for agent in agents])

@app.route('/api/profile', methods=['GET'])
@app.route('/api/profile/<int:agent_id>', methods=['GET'])
def get_profile(agent_id=None):
    if agent_id:
        agent = Agent.query.get(agent_id)
    else:
        # Default to Vnonymus if no ID provided (for backward compatibility)
        agent = Agent.query.filter_by(codename="Vnonymus").first()
    
    if not agent:
        return jsonify({"error": "Agent not found"}), 404

    # Get Agent Data
    agent_data = agent.data
    history = agent_data.get_history()
    achievements = agent_data.get_achievements()

    # Calculate Stats (returns full RPG data including rank)
    rpg_data = calculate_stats(agent.birth_date, history, achievements)
    
    rank_info = rpg_data['rank']
    
    # Update Rank in DB if changed
    if agent.rank != f"{rank_info['tier']} {rank_info['title']}":
        agent.rank = f"{rank_info['tier']} {rank_info['title']}"
        db.session.commit()

    return jsonify({
        "id": agent.id,
        "name": agent.name,
        "codename": agent.codename,
        "role": agent.role,
        "avatar": agent.avatar,
        "birthDate": agent.birth_date,
        "jobStatus": "open", # Todo: Add to DB
        "stats": rpg_data['stats'],
        "rank": rank_info,
        "history": rpg_data['history'],
        "achievements": rpg_data['achievements'],
        "skills": rpg_data['skills'],
        "age": rpg_data['age'],
        "level": rpg_data.get('level', 0),
        "current_xp": rpg_data.get('current_xp', 0),
        "next_level_xp": rpg_data.get('next_level_xp', 100),
        "agent_point": rpg_data.get('agent_point', 0)
    })

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    # Simple check for now (In production use werkzeug.security.check_password_hash)
    # Admin user seeded in seed.py: admin / admin123
    user = User.query.filter_by(username=username).first()
    
    if user and user.check_password(password):
        return jsonify({
            "message": "Login successful",
            "token": "fake-jwt-token-for-demo", # In prod use flask-jwt-extended
            "user": {"id": user.id, "username": user.username, "role": user.role}
        })
    
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/projects', methods=['GET'])
def get_projects():
    # Mock Data for Lab Projects
    projects = [
        {"id": "kai_labs_core", "name": "KAI Labs Core System", "type": "Full Stack"},
        {"id": "cyber_security_audit", "name": "Cyber Security Audit Tool", "type": "Security"},
        {"id": "ai_agent_framework", "name": "Autonomous AI Agent Framework", "type": "AI/ML"},
        {"id": "quantum_encryption", "name": "Quantum Encryption Module", "type": "Cryptography"},
        {"id": "neon_ui_kit", "name": "Neon UI Design System", "type": "Frontend"},
    ]
    return jsonify(projects)

@app.route('/api/activity-rules', methods=['GET'])
def get_activity_rules():
    return jsonify(ACTIVITY_RULES)

@app.route('/api/profile/<int:agent_id>', methods=['PUT'])
def update_profile(agent_id):
    agent = Agent.query.get(agent_id)
    if not agent:
        return jsonify({"error": "Agent not found"}), 404
    
    data = request.json
    
    # Update Agent Data
    if 'avatar' in data:
        agent.avatar = data['avatar']
        
    if 'history' in data:
        current_history = agent.data.get_history()
        
        # If history is a list, replace it (legacy/bulk update) - Ensure IDs
        if isinstance(data['history'], list):
            for item in data['history']:
                if 'id' not in item: item['id'] = str(uuid.uuid4())
            agent.data.set_history(data['history'])
            
        # If it's a single item, append it
        elif isinstance(data['history'], dict):
            new_item = data['history']
            if 'id' not in new_item: new_item['id'] = str(uuid.uuid4())
            current_history.append(new_item)
            agent.data.set_history(current_history)
            
    if 'achievements' in data:
        current_achievements = agent.data.get_achievements()
        
        # If achievements is a list, replace it
        if isinstance(data['achievements'], list):
            for item in data['achievements']:
                if 'id' not in item: item['id'] = str(uuid.uuid4())
            agent.data.set_achievements(data['achievements'])
            
        # If it's a single item, append it
        elif isinstance(data['achievements'], dict):
            new_item = data['achievements']
            if 'id' not in new_item: new_item['id'] = str(uuid.uuid4())
            current_achievements.append(new_item)
            agent.data.set_achievements(current_achievements)
    
    db.session.commit()
    
    return jsonify({"message": "Profile updated successfully"})

@app.route('/api/profile/<int:agent_id>/item/<string:item_id>', methods=['DELETE'])
def delete_item(agent_id, item_id):
    agent = Agent.query.get(agent_id)
    if not agent:
        return jsonify({"error": "Agent not found"}), 404
    
    # Check History
    history = agent.data.get_history()
    new_history = [item for item in history if str(item.get('id')) != item_id]
    
    # Check Achievements
    achievements = agent.data.get_achievements()
    new_achievements = [item for item in achievements if str(item.get('id')) != item_id]
    
    if len(new_history) != len(history):
        agent.data.set_history(new_history)
    
    if len(new_achievements) != len(achievements):
        agent.data.set_achievements(new_achievements)
        
    db.session.commit()
    return jsonify({"message": "Item deleted"})

@app.route('/api/profile/<int:agent_id>/item/<string:item_id>', methods=['PUT'])
def edit_item(agent_id, item_id):
    agent = Agent.query.get(agent_id)
    if not agent:
        return jsonify({"error": "Agent not found"}), 404
        
    data = request.json
    
    # Update History
    history = agent.data.get_history()
    for i, item in enumerate(history):
        if str(item.get('id')) == item_id:
            history[i] = {**item, **data}
            agent.data.set_history(history)
            db.session.commit()
            return jsonify({"message": "Item updated"})
            
    # Update Achievements
    achievements = agent.data.get_achievements()
    for i, item in enumerate(achievements):
        if str(item.get('id')) == item_id:
            achievements[i] = {**item, **data}
            agent.data.set_achievements(achievements)
            db.session.commit()
            return jsonify({"message": "Item updated"})

    return jsonify({"error": "Item not found"}), 404

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001)
