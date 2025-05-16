# Leaderboard related endpoints
from flask import Blueprint, jsonify
from supabase import create_client, Client
import os

leaderboard_route = Blueprint('leaderboard', __name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@leaderboard_route.route("/", methods=["GET"])
def get_leaderboard():
    try:
        result = supabase.table("UserAchievements")\
            .select("user_id, quiz_score, leaderboard_rank")\
            .order("quiz_score", desc=True)\
            .limit(10).execute() # Get top 10 users from LB
            
        return jsonify({"leaderboard": result.data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500