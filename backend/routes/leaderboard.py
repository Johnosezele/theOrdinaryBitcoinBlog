# Leaderboard related endpoints
from flask import Blueprint, jsonify
from supabase import create_client
import os

leaderboard_route = Blueprint('leaderboard', __name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@leaderboard_route.route("/", methods=["GET"])
def get_leaderboard():
    try:
        # Get top 10 users from the leaderboard db
        result = supabase.table("leaderboard").select("user_id, display_name, total_points").order("total_points", desc=True).limit(10).execute()
            
        return jsonify({"leaderboard": result.data}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500