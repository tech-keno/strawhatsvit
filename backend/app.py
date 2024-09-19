from flask import Flask, request, render_template_string, redirect, url_for, session, jsonify
from flask_session import Session
from bcrypt import hashpw, gensalt, checkpw
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import os
import pathlib
import pandas as pd
from dotenv import load_dotenv
from algo import main

app = Flask(__name__)

# Enable Cors so we can communicate with frontend
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# Configure session management to use the filesystem
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = 'RT'

# Load environment variables from .env file
load_dotenv()
app.config["MONGO_URI"] = os.getenv("MONGO_URI")


Session(app)

# Setting up database
client = MongoClient(app.config["MONGO_URI"])
db = client.mydatabase
users_collection = db["users"]

@app.route('/')
def home():
    return "Straw Hats Home Base"

# Route to check user authentication status
@app.route('/check-auth', methods=['GET'])
def check_auth():
    print(session)
    # return jsonify({'authenticated': True}), 200
    if 'username' in session:
        return jsonify({'authenticated': True, 'username': session['username']}), 200
    else:
        return jsonify({'authenticated': False}), 401


# Route for login
@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        data = request.json
        username = data.get("username")
        password = data.get("password")

        user = users_collection.find_one({"username": username})
        if user and checkpw(password.encode("utf-8"), user["password"]):
            session["username"] = str(user["_id"])
            return redirect(url_for("check_auth"))
        else:
            return "Invalid username or password!", 401
    return render_template_string('''
    <form method="post">
        Username: <input type="text" name="username"><br>
        Password: <input type="password" name="password"><br>
        <input type="submit" value="Login">
    </form>
    ''')

# Logout route to clear user session
@app.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200

# Register route to create a new user
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        if users_collection.find_one({"username": username}):
            return "Username already exists man!"

        hashed_password = hashpw(password.encode("utf-8"), gensalt())

        users_collection.insert_one({"username": username, "password": hashed_password})

        return redirect(url_for("login"))

    return render_template_string('''
    <form method="post">
        Username: <input type="text" name="username"><br>
        Password: <input type="password" name="password"><br>
        <input type="submit" value="Register">
    </form>
    ''')

# Route to get a document from MongoDB by its ID
@app.route('/document/<id>', methods=['GET'])
def get_document_by_id(id):
    try:
        document = db.mycollection.find_one({"_id": ObjectId(id)})
        if document:
            document['_id'] = str(document['_id'])
            return jsonify(document)
        else:
            return jsonify({"error": "Document not found"}), 404
    except:
        return jsonify({"error": "Invalid ID format"}), 400

# Route to add a new document to the collection
@app.route('/document', methods=['POST'])
def add_document():
    data = request.json
    if isinstance(data, list) and len(data) > 0:
        result = db.info.insert_one(data[0])  
        return jsonify({"_id": str(result.inserted_id), "message": "Document added"}), 201
    else:
        return jsonify({"error": "Invalid data format"}), 400

@app.route('/document/<collection_name>', methods=['POST'])
def save_document(collection_name):
    data = request.get_json()
    if data:
        collection = db[collection_name]
        for item in data:
            # Ensure each document has a unique 'id' field
            collection.update_one({'id': item['id']}, {'$set': item}, upsert=True)
        return jsonify({"message": "Data saved successfully!"}), 200
    return jsonify({"message": "No data received"}), 400



# Route to delete a document by its ID
@app.route('/document/<id>', methods=['DELETE'])
def delete_document(id):
    try:
        result = db.mycollection.delete_one({"_id": ObjectId(id)})
        if result.deleted_count > 0:
            return jsonify({"message": "Document deleted"})
        else:
            return jsonify({"error": "Document not found"}), 404
    except:
        return jsonify({"error": "Invalid ID format"}), 400

# Route to update a document by its name
@app.route('/document/name/<name>', methods=['PUT'])
def update_document_by_name(name):
    data = request.json
    result = db.mycollection.update_one({"name": name}, {"$set": data})
    if result.matched_count > 0:
        return jsonify({"message": "Document updated"})
    else:
        return jsonify({"error": "Document not found"}), 404

# Route to retrieve documents by collection name
@app.route('/documents/<collection_name>', methods=['GET'])
def get_documents_by_collection(collection_name):
    try:
        collection = db[collection_name]
        documents = collection.find()
        result = [{item: doc[item] for item in doc if item != '_id'} for doc in documents]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to retrieve all documents from the collection
@app.route('/documents', methods=['GET'])
def get_documents():
    documents = db.mycollection.find()
    result = [{item: doc[item] for item in doc if item != '_id'} for doc in documents]
    return jsonify(result)

# Route to upload a file
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = file.filename
    uploads_folder = r'uploads'

    if not os.path.exists(uploads_folder):
        os.makedirs(uploads_folder)

    filepath = os.path.join(uploads_folder, filename)
    file.save(filepath)

    return jsonify({"message": "File uploaded successfully", "filename": filename}), 200

# Route to process CSV files using our algorithm
@app.route('/process', methods = ['GET'])
def process_csv():
    try :
        main()
        return jsonify({"message": "File uploaded successfully"}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": "Invalid ID format"}), 400

    

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
    