from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask import render_template
import os

app = Flask(__name__)

app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb://localhost:27017/mydatabase")

print(os.getenv("5555" + "MONGO_URI"))

client = MongoClient(app.config["MONGO_URI"])
db = client.mydatabase

@app.route('/')
def home():
    return "Straw Hats Home Base"

@app.route('/add', methods=['POST'])
def add_document():
    data = request.json
    result = db.mycollection.insert_one(data)
    return jsonify({"_id": str(result.inserted_id)})

@app.route('/documents', methods=['GET'])
def get_documents():
    documents = db.mycollection.find()
    result = [{item: doc[item] for item in doc if item != '_id'} for doc in documents]
    return jsonify(result)

@app.route('/document/<id>', methods=['GET'])
def get_document(id):
    document = db.mycollection.find_one({"_id": id})
    if document:
        result = {item: document[item] for item in document if item != '_id'}
        return jsonify(result)
    return jsonify({"error": "Document not found"}), 404

@app.route('/update/<id>', methods=['PUT'])
def update_document(id):
    data = request.json
    result = db.mycollection.update_one({"_id": id}, {"$set": data})
    if result.matched_count:
        return jsonify({"message": "Document updated"})
    return jsonify({"error": "Document not found"}), 404

@app.route('/delete/<id>', methods=['DELETE'])
def delete_document(id):
    result = db.mycollection.delete_one({"_id": id})
    if result.deleted_count:
        return jsonify({"message": "Document deleted"})
    return jsonify({"error": "Document not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
