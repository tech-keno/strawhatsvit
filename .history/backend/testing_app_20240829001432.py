import unittest
from app import app, db
from flask import json
from bson.objectid import ObjectId
import tempfile
import os

class FlaskAppTests(unittest.TestCase):
    def setUp(self):
        # Set up the test client and context
        self.app = app.test_client()
        self.app.testing = True
        
        # Set up a temporary database for testing
        self.db_client = db.client
        self.db = self.db_client["mydatabase"]
        self.collection = self.db["mycollection"]
        self.users_collection = self.db["users"]

        # Add a test user
        self.test_user = {
            "username": "testuser",
            "password": "testpassword"
        }
        self.users_collection.insert_one({
            "username": self.test_user["username"],
            "password": self.test_user["password"]
        })

    def tearDown(self):
        # Clean up the database after each test
        self.db.drop_collection("mycollection")
        self.db.drop_collection("users")

    def test_home(self):
        response = self.app.get('/')
        self.assertEqual(response.data, b'Straw Hats Home Base')
        self.assertEqual(response.status_code, 200)

    def test_register_post_existing_user(self):
        response = self.app.post('/register', data=self.test_user)
        self.assertEqual(response.data, b'Username already exists man!')
        self.assertEqual(response.status_code, 200)

    def test_register_post_new_user(self):
        new_user = {
            "username": "newuser",
            "password": "newpassword"
        }
        response = self.app.post('/register', data=new_user)
        self.assertEqual(response.status_code, 302)  # Expect a redirect
        self.assertEqual(response.location, 'http://localhost/login')

    def test_get_document_by_id(self):
        # Insert a test document
        doc = {"name": "Test Document", "description": "A test document"}
        result = self.collection.insert_one(doc)
        doc_id = result.inserted_id
        
        response = self.app.get(f'/document/{doc_id}')
        data = json.loads(response.data)
        self.assertEqual(data['name'], "Test Document")
        self.assertEqual(response.status_code, 200)

    def test_add_document(self):
        doc = {"name": "New Document", "description": "A new document"}
        response = self.app.post('/document', json=doc)
        data = json.loads(response.data)
        self.assertIn("_id", data)
        self.assertEqual(data["message"], "Document added")
        self.assertEqual(response.status_code, 201)

    def test_delete_document(self):
        doc = {"name": "Document to delete", "description": "This document will be deleted"}
        result = self.collection.insert_one(doc)
        doc_id = result.inserted_id
        
        response = self.app.delete(f'/document/{doc_id}')
        data = json.loads(response.data)
        self.assertEqual(data["message"], "Document deleted")
        self.assertEqual(response.status_code, 200)

    def test_update_document_by_name(self):
        doc = {"name": "Document to update", "description": "This document will be updated"}
        self.collection.insert_one(doc)
        
        update_data = {"description": "Updated description"}
        response = self.app.put('/document/name/Document to update', json=update_data)
        data = json.loads(response.data)
        self.assertEqual(data["message"], "Document updated")
        self.assertEqual(response.status_code, 200)

    def test_get_documents(self):
        doc1 = {"name": "Doc 1", "description": "First doc"}
        doc2 = {"name": "Doc 2", "description": "Second doc"}
        self.collection.insert_many([doc1, doc2])
        
        response = self.app.get('/documents')
        data = json.loads(response.data)
        self.assertEqual(len(data), 2)
        self.assertEqual(response.status_code, 200)

    def test_upload_file(self):
        data = {
            'file': (tempfile.NamedTemporaryFile(delete=False, suffix='.txt'), 'testfile.txt')
        }
        response = self.app.post('/upload', content_type='multipart/form-data', data=data)
        self.assertEqual(response.json["message"], "File uploaded successfully")
        self.assertEqual(response.status_code, 200)

    def test_process_csv(self):
        csv_data = "name,description\nTest,This is a test"
        csv_path = os.path.join('uploads', 'test.csv')
        with open(csv_path, 'w') as f:
            f.write(csv_data)
        
        response = self.app.get('/process')
        data = json.loads(response.data)
        self.assertIn("file", data)
        self.assertEqual(response.status_code, 200)

        os.remove(csv_path)

if __name__ == '__main__':
    unittest.main()
