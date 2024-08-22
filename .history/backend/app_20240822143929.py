from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import os
import pathlib
import pandas as pd

app = Flask(__name__)
CORS(app)  # try enable cors

# strawhats mongodb uri key in env
app.config["MONGO_URI"] = os.getenv("MONGO_URI")

client = MongoClient(app.config["MONGO_URI"])
db = client.mydatabase

@app.route('/')
def home():
    return "Straw Hats Home Base"

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
        return {{"empty" : "empty"}}
    
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
