# Auth verification endpoints
from flask import Blueprint, request, jsonify
from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

auth_route = Blueprint('auth', __name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@auth_route.route("/verify", methods=["POST"])
def verify():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing token"}), 401
    
    token = auth_header.split("Bearer ")[-1]
    try:
        user = supabase.auth.get_user(token).user
        
        if user:
            return jsonify({
                "info": {
                    "email": user.email,
                    "name": user.user_metadata.get("full name", "NA"),
                }
            })
        else:
            return jsonify({"error": "User not found."}), 404
        
    except Exception as e:
        return jsonify({"error": str{e}}), 500