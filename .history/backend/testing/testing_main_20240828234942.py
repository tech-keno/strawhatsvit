from flask import Flask, request, render_template_string, redirect, url_for, session, jsonify
from bcrypt import hashpw, gensalt, checkpw
from flask_cors import CORS  
from pymongo import MongoClient
from bson.objectid import ObjectId
import os
import pathlib
import pandas as pd

app = Flask(__name__)
CORS(app)  # enabling cors

app.config["MONGO_URI"] = os.getenv("MONGO_URI")
client = MongoClient(app.config["MONGO_URI"])


def test_register_user():
    with app.test_client() as test_client:
        response = test_client.post('/register', data={'username': 'testing123321', 'password': 'testingpassword123321'})
        assert response.status_code == 200
        assert response.get_json() == {"message": "User registered successfully!"}
        return True

def main():
    if test_register_user():
        print("Registration Test Passed ✅")

if __name__ == '__main__':
    main()
