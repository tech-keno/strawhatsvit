from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB URI key in environment variables
app.config["MONGO_URI"] = os.getenv("MONGO_URI")

client = MongoClient(app.config["MONGO_URI"])
db = client.mydatabase

@app.route('/')
def home():
    return "Straw Hats Home Base"

@app.route('/document', methods=['POST'])
def add_document():
    data = request.json
    result = db.mycollection.insert_one(data)
    return jsonify({"_id": str(result.inserted_id), "message": "Document added"}), 201

# The other routes remain the same

if __name__ == '__main__':
    app.run(debug=True)
