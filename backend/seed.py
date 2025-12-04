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

    with app.app_context():
        print("Creating tables...")
        db.create_all()

        # 1. Seed Agent (Vnonymus)
        if not Agent.query.filter_by(codename="Vnonymus").first():
            print("Seeding Vnonymus agent...")
            vnonymus = Agent(
                codename="Vnonymus",
                name="Vnonymus",
                role="Full Stack Developer",
                rank="F INTERN",
                avatar="/images/Vnonymus.jpg",
                birth_date=PROFILE_DATA["birthDate"]
            )
            db.session.add(vnonymus)
            db.session.commit() # Commit to get ID

            # Create Agent Data
            agent_data = AgentData(agent_id=vnonymus.id)
            agent_data.set_history(PROFILE_DATA["history"])
            agent_data.set_achievements(PROFILE_DATA["achievements"])
            db.session.add(agent_data)
            db.session.commit()
            print("Agent seeded.")
        else:
            print("Agent Vnonymus already exists.")

        # 2. Seed Admin User
        admin = User.query.filter_by(username="admin").first()
        if not admin:
            print("Seeding Admin user...")
            admin = User(username="admin", role="admin")
            db.session.add(admin)
        
        # Always update password to ensure it's hashed and correct
        # This fixes the issue where old plaintext passwords persist
        admin.set_password("admin123")
        db.session.commit()
        print("Admin user seeded/updated.")
            
        print("Seeding complete check!")

if __name__ == "__main__":
    seed_database()
