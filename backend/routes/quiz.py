# Quiz submission endpoints
from flask import Blueprint, request, jsonify
from supabase import create_client, Client
import os
import uuid
from datetime import datetime

quiz_route = Blueprint('quiz', __name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Quiz submission logic
@quiz_route.route("/submit", methods=["POST"])
def submit_quiz():
    data = request.get_json()
    
    # Fields from frontend api call
    user_id = data.get("user_id")
    story_id = data.get("story_id")
    points = data.get("points")
    
    if not all([user_id, story_id, points]):
        return jsonify({"error": "Missing Fields"}), 400
    
    try:
        new_row = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "story_id": story_id,
            "quiz_score": points,
            "completed_at": datetime.utcnow().isoformat(), 
            "leaderboard_rank": None  # Can be computed later
        }
        
        result = supabase.table("UserAchievements").insert(new_row).execute()
        
        return jsonify({"message": "Quiz submission recorded", "data": result.data}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Route for getting quiz result + leaderboard    
@quiz_route.route("/me/quiz", methods=["POST"])
def get_user_quiz_data():
    data = request.get_json()
    
    user_id = data.get("user_id")
    story_id = data.get("story_id")
    
    if not all([user_id, story_id]):
        return jsonify({"error": "Missing Fields"}), 400
    
    try:
        result = supabase.table("UserAchievements")\
            .select("quiz_score, completed_at, leaderboard_rank")\
            .eq("user_id", user_id)\
            .eq("story_id", story_id)\
            .limit(1).execute()
        
        quiz_data = result.data[0] if result.data else None

        return jsonify({
            "quizScore": quiz_data["quiz_score"] if quiz_data else "N/A",
            "leaderboardPosition": quiz_data.get("leaderboard_rank", "N/A"),
            "completedAt": quiz_data.get("completed_at", None)
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
# Quiz retrieval logic
@quiz_route.route('/questions', methods=['GET'])
def get_quiz_questions():
    response = supabase.table("QuizQuestions").select("*").execute() 
    
    # Retrieve data from rows
    quiz_dict = []
    for row in response.data:
        # Map each option
        option_map = {
            "A": row["option_a"],
            "B": row["option_b"],
            "C": row["option_c"],
            "D": row["option_d"]
        }
        
        # Get the correct answer
        correct_answer_text = option_map.get(row["correct_option"], "Unknown option")
        
        row_data = {
            "story_id": row['story_id'],
            "question_text": row['question_text'],
            "correct_option": correct_answer_text,
            "option_a": row['option_a'],
            "option_b": row['option_b'],
            "option_c": row['option_c'],
            "option_d": row['option_d']
        }
        
        quiz_dict.append(row_data)
           
    return jsonify({"questions": quiz_dict}), 200