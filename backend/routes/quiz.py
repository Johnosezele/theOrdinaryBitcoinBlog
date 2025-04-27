# Quiz submission endpoints
from flask import Blueprint, request, jsonify
from supabase import create_client
import os
import uuid

quiz_route = Blueprint('quiz', __name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@quiz_route.route("/submit", methods=["POST"])
def submit_quiz():
    data = request.get_json()
    
    # Fields from frontend api call
    user_id = data.get("user_id")
    quiz_id = data.get("quiz_id")
    points = data.get("points")
    
    if not all([user_id, quiz_id, points]):
        return jsonify({"error": "Missing Fields"}), 400
    
    try:
        result = supabase.table("scores").insert({
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "quiz_id": quiz_id,
            "points": points
        }).execute()
        
        return jsonify({"message": "Quiz submission recorded", "data": result.data}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500