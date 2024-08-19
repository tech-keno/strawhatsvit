from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask import render_template
import os

app = Flask(__name__)

# strawhats mongodb uri key in env
app.config["MONGO_URI"] = os.getenv("MONGO_URI")

client = MongoClient(app.config["MONGO_URI"])
db = client.mydatabase


@app.route('/')
def home():
    return "Straw Hats Home Base"

# adding a test document to the database
@app.route('/add-test', methods=['GET'])
def add_test_document():
    test_data = {
        "name": "Straw Hats Members",
        "description": "Keno, William, Ibrahim, Sam, Eliza"
    }
    result = db.mycollection.insert_one(test_data)
    return jsonify({"_id": str(result.inserted_id), "message": "document added"})


@app.route('/documents', methods=['GET'])
def get_documents():
    documents = db.mycollection.find()
    result = [{item: doc[item] for item in doc if item != '_id'} for doc in documents]
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
