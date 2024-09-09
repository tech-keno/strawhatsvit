from flask import Flask, request, render_template_string, redirect, url_for, session, jsonify
from bcrypt import hashpw, gensalt, checkpw
from flask_cors import CORS  
from pymongo import MongoClient
from bson.objectid import ObjectId
import os
import pathlib
import pandas as pd
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://127.0.0.1:3000"])


load_dotenv()
# strawhats mongodb uri key in env
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "NP")
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = False

client = MongoClient(app.config["MONGO_URI"])
db = client.mydatabase
users_collection = db["users"]

@app.route('/')
def home():
    return "Straw Hats Home Base"

@app.route('/check-auth', methods=['GET'])
def check_auth():
    print(session)
    if 'user_id' in session:
        return jsonify({"authenticated": True}), 200
    else:
        return jsonify({"authenticated": False}), 401
    
@app.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200



@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        if users_collection.find_one({"username": username}):
            return "Username already exists man!"

        hashed_password = hashpw(password.encode("utf-8"), gensalt())

        users_collection.insert_one({"username": username, "password": hashed_password})

        # add a route for login
        return redirect(url_for("login"))
    
    # for testing purposes frontend will be better
    return render_template_string('''
    <form method="post">
        Username: <input type="text" name="username"><br>
        Password: <input type="password" name="password"><br>
        <input type="submit" value="Register">
    </form>
    ''')

@app.route("/login", methods=["POST"])
def login():
    data = request.json 
    if not data:
        return jsonify({"error": "No data provided"}), 400

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = users_collection.find_one({"username": username})

    if user:
        if checkpw(password.encode("utf-8"), user["password"]):
            session["user_id"] = str(user["_id"])
            print(str(user["_id"]))
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"error": "Incorrect password"}), 401
    else:
        return jsonify({"error": "User not found"}), 404


@app.route('/document/<id>', methods=['GET'])
def get_document_by_id(id):
    try:
        document = db.mycollection.find_one({"_id": ObjectId(id)})
        if document:
            document['_id'] = str(document['_id'])  # first convert object id to string
            return jsonify(document)
        else:
            return jsonify({"error": "Document not found"}), 404
    except:
        return jsonify({"error": "Invalid ID format"}), 400

@app.route('/document', methods=['POST'])
def add_document():
    data = request.json
    result = db.mycollection.insert_one(data)
    return jsonify({"_id": str(result.inserted_id), "message": "Document added"}), 201

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

@app.route('/document/name/<name>', methods=['PUT'])
def update_document_by_name(name):
    data = request.json
    result = db.mycollection.update_one({"name": name}, {"$set": data})
    if result.matched_count > 0:
        return jsonify({"message": "Document updated"})
    else:
        return jsonify({"error": "Document not found"}), 404

# @app.route('/add-test', methods=['GET'])
# def add_test_document():
#     test_data = {
#         "name": "Straw Hats Members",
#         "description": "Keno, William, Ibrahim, Sam, Eliza"
#     }
#     result = db.mycollection.insert_one(test_data)
#     return jsonify({"_id": str(result.inserted_id), "message": "Document added successfullyy"})

@app.route('/documents', methods=['GET'])
def get_documents():
    documents = db.mycollection.find()
    result = [{item: doc[item] for item in doc if item != '_id'} for doc in documents]
    return jsonify(result)

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

@app.route('/process', methods = ['GET'])
def process_csv():
    if not os.path.exists(r'uploads'):
        return jsonify({"uploads_folder" : "empty"})
    
    curr_dir = pathlib.Path(__file__).parent.resolve().as_posix()
    uploads_dir = curr_dir + '/uploads'
    pathlist = pathlib.Path(uploads_dir).rglob('*.csv')
    path_in_str = ""

    for path in pathlist:
        path_in_str = str(path)
        if ".csv" in path_in_str:
            break
    
    df = pd.read_csv(path_in_str).to_string()

    return jsonify({"file": df})


if __name__ == '__main__':
    app.run(debug=True)
