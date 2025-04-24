from flask import Flask, request, jsonify
from supabase import create_client, Client
from dotenv import load_dotenv
from flask_cors import CORS
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route("/verify", methods=["POST"])
def verify():
    """User verification using OAuth"""
    auth_header = request.headers.get("Authorization", "") # Get the header
    if not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing token"}), 401

    token = auth_header.split("Bearer ")[-1] # Extract the token
    try:
        user = supabase.auth.get_user(token).user
        if user:
            user_info = {
                "email": user.email,
                "name": user.user_metadata.get("full_name", "Unknown"),
            }
            return jsonify({"info": user_info})
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/")
def home():
    return jsonify({"message": "Flask API running"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)