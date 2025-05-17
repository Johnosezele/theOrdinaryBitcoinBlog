from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

from routes.auth import auth_route
from routes.quiz import quiz_route
from routes.leaderboard import leaderboard_route

load_dotenv()

# Initialize flask app & set up CORS
app = Flask(__name__)

# More secure CORS setup with environment variable
cors_origins = os.environ.get('CORS_ORIGINS', 'https://ordinarybitcoinblog.vercel.app,http://localhost:5173,http://localhost:3000')
origins = cors_origins.split(',')
CORS(app, resources={r"/*": {"origins": origins}})

# Register Blueprints 
app.register_blueprint(auth_route, url_prefix="/auth")
app.register_blueprint(quiz_route, url_prefix="/quiz")
app.register_blueprint(leaderboard_route, url_prefix="/leaderboard")

@app.route("/")
def home():
    return jsonify({"message": "Flask API running"})

@app.route("/health")
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_ENV") == "development")