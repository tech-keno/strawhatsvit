from flask import Flask, jsonify, request
from pymongo import MongoClient

app = Flask(__name__)

# Use your MongoDB URI
client = MongoClient('mongodb+srv://strawhats:iEXibstNH2FplQf8@strawhatsdatabase.8ymeywa.mongodb.net/?retryWrites=true&w=majority&appName=StrawHatsDatabase')
db = client['strawhats']  # Replace 'mydatabase' with your database name
collection = db['first']  # Replace 'mycollection' with your collection name

@app.route('/')
def home():
    return "Welcome to the Flask MongoDB example!"

@app.route('/add', methods=['POST'])
def add_document():
    data = request.json
    result = collection.insert_one(data)
    return jsonify({'inserted_id': str(result.inserted_id)})

@app.route('/get', methods=['GET'])
def get_documents():
    documents = collection.find()
    output = [{item: doc[item] for item in doc if item != '_id'} for doc in documents]
    return jsonify(output)

if __name__ == '__main__':
    app.run(debug=True)
