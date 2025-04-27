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
    # Retrieve leaderboard logic
    return None