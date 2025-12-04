from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='agent') # admin, agent
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Agent(db.Model):
    __tablename__ = 'agents'
    id = db.Column(db.Integer, primary_key=True)
    codename = db.Column(db.String(50), unique=True, nullable=False) # e.g. "Vnonymus"
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100)) # e.g. "Full Stack Developer"
    rank = db.Column(db.String(50)) # e.g. "F INTERN"
    avatar = db.Column(db.String(255))
    bio = db.Column(db.Text)
    birth_date = db.Column(db.String(20)) # 'YYYY-MM-DD'
    
    # Relationships
    data = db.relationship('AgentData', backref='agent', uselist=False, cascade="all, delete-orphan")

class AgentData(db.Model):
    __tablename__ = 'agent_data'
    id = db.Column(db.Integer, primary_key=True)
    agent_id = db.Column(db.Integer, db.ForeignKey('agents.id'), unique=True, nullable=False)
    
    # Storing complex structures as JSON strings for flexibility
    history = db.Column(db.Text) # JSON list of history items
    achievements = db.Column(db.Text) # JSON list of certificates
    stats_cache = db.Column(db.Text) # JSON object of calculated stats (optional cache)
    
    def get_history(self):
        return json.loads(self.history) if self.history else []
    
    def get_achievements(self):
        return json.loads(self.achievements) if self.achievements else []

    def set_history(self, data):
        self.history = json.dumps(data)

    def set_achievements(self, data):
        self.achievements = json.dumps(data)
