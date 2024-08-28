from test_register import test_register_user
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

def main():
    if test_register_user(client):
        print("Registration Test Passed ✅")

if __name__ == '__main__':
    main()
