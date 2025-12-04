from app import app
from models import Agent
from rpg_system import calculate_stats

with app.app_context():
    print("Attempting to query agents...")
    try:
        agent = Agent.query.filter_by(codename="Vnonymus").first()
        if agent:
            print(f"Found agent: {agent.name}")
            history = agent.data.get_history()
            achievements = agent.data.get_achievements()
            print("Calculating stats...")
            rpg_data = calculate_stats(agent.birth_date, history, achievements)
            print("Stats calculated successfully.")
            print(f"Rank: {rpg_data['rank']}")
        else:
            print("Agent not found.")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
