from app import app
from models import db, User, Agent, AgentData
from data import PROFILE_DATA
import json
import os

def create_database_if_not_exists():
    # For PostgreSQL (Neon), the database is already created.
    # We only need this for local SQL Server development if needed, 
    # but for now we rely on SQLAlchemy to create tables.
    pass

def seed_database():
    create_database_if_not_exists()
    
    with app.app_context():
        print("Creating tables...")
        db.create_all()

        # Check if Vnonymus exists
        if Agent.query.filter_by(codename="Vnonymus").first():
            print("Database already seeded.")
            return

        print("Seeding Vnonymus agent...")
        
        # Create Agent
        vnonymus = Agent(
            codename="Vnonymus",
            name="Vnonymus", # Using codename as name for now based on current UI
            role="Full Stack Developer",
            rank="F INTERN", # Initial rank, will be recalculated
            avatar="/images/Vnonymus.jpg",
            birth_date=PROFILE_DATA["birthDate"]
        )
        db.session.add(vnonymus)
        db.session.commit()

        # Create Agent Data
        agent_data = AgentData(agent_id=vnonymus.id)
        agent_data.set_history(PROFILE_DATA["history"])
        agent_data.set_achievements(PROFILE_DATA["achievements"])
        
        db.session.add(agent_data)
        
        # Create Admin User
        admin = User(username="admin", password_hash="admin123", role="admin") # In real app, hash this!
        db.session.add(admin)
        
        db.session.commit()
        print("Seeding complete!")

if __name__ == "__main__":
    seed_database()
