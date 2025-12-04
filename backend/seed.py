import pyodbc
from app import app
from models import db, User, Agent, AgentData
from data import PROFILE_DATA
import json
import os

def create_database_if_not_exists():
    # Parse connection string to get server
    # Assuming standard format from .env
    conn_str = os.getenv('DATABASE_URL')
    if 'mssql+pyodbc://' in conn_str:
        # Extract server from connection string or use localhost default
        server = 'localhost\\SQLEXPRESS' 
        driver = '{ODBC Driver 17 for SQL Server}'
        
        # Connect to master
        master_conn_str = f"DRIVER={driver};SERVER={server};DATABASE=master;Trusted_Connection=yes;AutoCommit=True;"
        try:
            cnxn = pyodbc.connect(master_conn_str, autocommit=True)
            cursor = cnxn.cursor()
            
            # Check if DB exists
            cursor.execute("SELECT name FROM master.dbo.sysdatabases WHERE name = N'KaiLabs'")
            if not cursor.fetchone():
                print("Database 'KaiLabs' not found. Creating...")
                cursor.execute("CREATE DATABASE KaiLabs")
                print("Database created.")
            else:
                print("Database 'KaiLabs' already exists.")
            
            cnxn.close()
        except Exception as e:
            print(f"Error checking/creating database: {e}")

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
