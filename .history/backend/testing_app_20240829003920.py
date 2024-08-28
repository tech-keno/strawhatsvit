import unittest
import os
from pymongo import MongoClient
from app import app, users_collection  # Import after setting the environment variable
from bcrypt import hashpw, gensalt

class RegisterRouteTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Set the MONGO_URI environment variable before importing the app
        os.environ['MONGO_URI'] = "mongodb+srv://strawhats:iEXibstNH2FplQf8@strawhatsdatabase.8ymeywa.mongodb.net/?retryWrites=true&w=majority&appName=StrawHatsDatabase"
        # Reinitialize the MongoClient to ensure it picks up the new URI
        client = MongoClient(os.getenv('MONGO_URI'))
        cls.db = client.mydatabase
        cls.users_collection = cls.db["users"]

    def setUp(self):
        # Set up the test client and context
        self.app = app.test_client()
        self.app.testing = True
        
        # Clear the users collection before each test
        self.users_collection.delete_many({})

    def tearDown(self):
        # Clean up the users collection after each test
        self.users_collection.delete_many({})

    def test_register_get(self):
        # Test the GET request to the register route
        response = self.app.get('/register')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Username:', response.data)

    def test_register_post_existing_user(self):
        # Insert a test user
        self.users_collection.insert_one({
            "username": "testuser",
            "password": hashpw("testpassword".encode("utf-8"), gensalt())
        })

        # Attempt to register with the same username
        response = self.app.post('/register', data={
            "username": "testuser",
            "password": "newpassword"
        })

        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Username already exists man!', response.data)

if __name__ == '__main__':
    unittest.main()
