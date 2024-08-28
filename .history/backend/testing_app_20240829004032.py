import unittest
from app import app, client, db, users_collection  # Import your app and database references
from bson.objectid import ObjectId

class FlaskAppTests(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        cls.client = app.test_client()
        cls.client.testing = True
        cls.db = db  # Reference to your database
        cls.users_collection = users_collection  # Reference to your users collection
    
    def setUp(self):
        # Ensure the database is empty before each test
        self.db.mycollection.delete_many({})
        self.users_collection.delete_many({})
    
    def test_home_route(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Straw Hats Home Base', response.data)
    
    def test_register_user(self):
        # Test user registration
        response = self.client.post('/register', data={'username': 'Luffy', 'password': 'GomuGomu'})
        self.assertEqual(response.status_code, 302)  # Expect redirect to login
        self.assertTrue(self.users_collection.find_one({"username": "Luffy"}))
    
    def test_register_duplicate_user(self):
        # Insert a user
        self.users_collection.insert_one({"username": "Zoro", "password": "Santoryu"})
        response = self.client.post('/register', data={'username': 'Zoro', 'password': 'SwordStyle'})
        self.assertIn(b'Username already exists man!', response.data)
    
    def test_add_and_get_document(self):
        # Test adding a document
        data = {"name": "Test Document", "description": "Test Description"}
        response = self.client.post('/document', json=data)
        self.assertEqual(response.status_code, 201)
        doc_id = response.json["_id"]
        
        # Test retrieving the document
        response = self.client.get(f'/document/{doc_id}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["name"], "Test Document")
    
    def test_update_document(self):
        # Insert a test document
        self.db.mycollection.insert_one({"name": "Old Name", "description": "Old Description"})
        
        # Update the document
        response = self.client.put('/document/name/Old Name', json={"description": "New Description"})
        self.assertEqual(response.status_code, 200)
        
        # Verify the document was updated
        updated_doc = self.db.mycollection.find_one({"name": "Old Name"})
        self.assertEqual(updated_doc["description"], "New Description")
    
    def test_delete_document(self):
        # Insert a test document
        result = self.db.mycollection.insert_one({"name": "Delete Me"})
        doc_id = str(result.inserted_id)
        
        # Delete the document
        response = self.client.delete(f'/document/{doc_id}')
        self.assertEqual(response.status_code, 200)
        
        # Verify the document was deleted
        self.assertIsNone(self.db.mycollection.find_one({"_id": ObjectId(doc_id)}))
    
    def test_upload_file(self):
        # Test uploading a file
        with open('test.csv', 'w') as f:
            f.write("name,description\nLuffy,Pirate\nZoro,Swordsman")
        
        with open('test.csv', 'rb') as f:
            response = self.client.post('/upload', data={'file': f})
            self.assertEqual(response.status_code, 200)
            self.assertIn(b'File uploaded successfully', response.data)
    
    def tearDown(self):
        # Clean up after each test
        self.db.mycollection.delete_many({})
        self.users_collection.delete_many({})
        if os.path.exists('test.csv'):
            os.remove('test.csv')
    
if __name__ == '__main__':
    unittest.main()
