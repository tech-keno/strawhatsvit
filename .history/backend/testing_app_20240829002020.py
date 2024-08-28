import unittest
from app import app, db, users_collection
from flask import json
from bcrypt import hashpw, gensalt

class RegisterRouteTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Set the MONGO_URI environment variable for the test environment
        os.environ['MONGO_URI'] = "mongodb+srv://strawhats:iEXibstNH2FplQf8@strawhatsdatabase.8ymeywa.mongodb.net/?retryWrites=true&w=majority&appName=StrawHatsDatabase"

    def setUp(self):
        # Set up the test client and context
        self.app = app.test_client()
        self.app.testing = True
        
        # Clear the users collection before each test
        users_collection.delete_many({})

    def tearDown(self):
        # Clean up the users collection after each test
        users_collection.delete_many({})

    def test_register_get(self):
        # Test the GET request to the register route
        response = self.app.get('/register')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Username:', response.data)

    def test_register_post_existing_user(self):
        # Insert a test user
        users_collection.insert_one({
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

    def test_register_post_new_user(self):
        # Attempt to register a new user
        response = self.app.post('/register', data={
            "username": "newuser",
            "password": "newpassword"
        })

        self.assertEqual(response.status_code, 302)  # Expect a redirect to login
        self.assertIn('/login', response.headers['Location'])

        # Verify the user was added to the database
        new_user = users_collection.find_one({"username": "newuser"})
        self.assertIsNotNone(new_user)
        self.assertTrue(hashpw("newpassword".encode("utf-8"), new_user["password"]))

if __name__ == '__main__':
    unittest.main()
