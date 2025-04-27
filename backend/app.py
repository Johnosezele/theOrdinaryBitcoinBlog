from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from routes.auth import auth_route
from routes.quiz import quiz_route
from routes.leaderboard import leaderboard_route

load_dotenv()

# Initialize flask app & set up CORS
app = Flask(__name__)
CORS(app)

# Register Blueprints 
app.register_blueprint(auth_route, url_prefix="/auth")
app.register_blueprint(quiz_route, url_prefix="/quiz")
app.register_blueprint(leaderboard_route, url_prefix="/leaderboard")

@app.route("/")
def home():
    return jsonify({"message": "Flask API running"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)