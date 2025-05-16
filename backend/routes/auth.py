# Auth verification endpoints
from flask import Blueprint, request, jsonify
from supabase import create_client, Client
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
        
        if not user:
            return jsonify({"error": "User not found."}), 404

        user_id = user.id
        email = user.email
        full_name = user.user_metadata.get("full name", "NA")

        existing = supabase.table("User").select("id").eq("id", user_id).execute()

        # If user doesn't already exist, insert new user data
        if not existing.data:
            supabase.table("User").insert({
                "id": user_id,
                "username": full_name,  
                "email": email,
                "created_at": user.created_at,  
            }).execute()

        auth_data = {
            "provider": user.app_metadata.get("provider"),
            "provider_user_id": user.identities[0]["id"] if user.identities else "unknown",
            "auth_data": user.dict()  
        }

        existing_auth = supabase.table("UserAuth").select("id").eq("user_id", user_id).execute()

        # Insert user data into 'UserAuth' table 
        if not existing_auth.data:
            supabase.table("UserAuth").insert({
                "user_id": user_id,
                "provider": auth_data["provider"],
                "provider_user_id": auth_data["provider_user_id"],
                "auth_data": auth_data
            }).execute()

        return jsonify({
            "info": {
                "email": email,
                "name": full_name,
            }
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500