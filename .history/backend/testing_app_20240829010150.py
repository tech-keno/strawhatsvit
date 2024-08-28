import unittest
from app import app, client, db, users_collection 
from bson.objectid import ObjectId
import os

class FlaskAppTests(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        cls.client = app.test_client()
        cls.client.testing = True
        cls.db = db 
        cls.users_collection = users_collection 
    
    def set_up(self):
        # start with nothing in the test databases to ensure test run is clean
        self.db.mycollection.delete_many({})
        self.users_collection.delete_many({})
    
    def test_home_route(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Straw Hats Home Base', response.data)
    
    def test_register_user(self):
        """
        Testing Registration

        Purpose: To verify that a new user can successfully register on the platform. The test will check whether the user’s username and password are correctly stored in the database.

        Setup: The test uses flask’s unit test to simulate a HTTP post request to the /register route in our flask app

        Execution:  The test posts a request to the /register endpoint with sample data, e.g {'username' : “Luffy”, ‘password’: “DevilFruiteater123”}, then the test checks whether the status code succeeds with status code 200.

        Exepected Outcome: The response code should be 200, which indicates a successful redirection. Now the user should also be present in the “users” collection using the 
        find_one function.
        
        """
        response = self.client.post('/register', data={'username': 'Luffy', 'password': 'DevilFruitEater123'})
        self.assertEqual(response.status_code, 200)  
        self.assertTrue(self.users_collection.find_one({"username": "Luffy"}))
    

    def test_register_duplicate_user(self):
        """
        Testing Registration of Duplicate User

        Purpose: To ensure that the application will prevent the registration of a duplicate username. This will also check that the application will return an error message when a user attempts to register with an existing username.

        Setup: The test will insert a username into the database, then simulate an HTTP POST request to the registration endpoint.

        Execution: The test will post a request to the /register route with the same username as the inserted on earlier. Then it will check whether the response is the same as the error message.

        Expected Outcome: The response should contain a message that username already exists. The database should NOT create a new entry for the username that already exists
        """
        self.users_collection.insert_one({"username": "Zoro", "password": "SantoryuLovesZoro"})
        response = self.client.post('/register', data={'username': 'Zoro', 'password': 'SwordStyle123321'})
        self.assertIn(b'Username already exists man!', response.data)
    
    def test_add_document(self):
        """
        Testing Add Document

        Purpose: To verify that a new document can successfully be added to the database. This 

        Setup: The test client will simulate an HTTP POST request to the /document route with a sample payload, e.g our team names

        Execution: The test will post a json payload to the /documen troute and after the document is added the test will check whether the response code is successful.

        Expected Outcome: The response status should be 201, which indicates success. The response should also include the id of the newly created document and the document should be seen present in the mycollection collection of the database.

        """
        data = {"name": "StrawHAts", "description": "Ibrahim, Keno, Will, Ibrahim, Sam, Eliza"}
        response = self.client.post('/document', json=data)
        self.assertEqual(response.status_code, 201)
        doc_id = response.json["_id"]
        # response = self.client.get(f'/document/{doc_id}')
        # self.assertEqual(response.status_code, 200)
        # self.assertEqual(response.json["name"], "Test Document")
    
    def test_update_document(self):
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
    
    # def clean_up(self):
    #     # delete everything in databases and uploads
    #     self.db.mycollection.delete_many({})
    #     self.users_collection.delete_many({})
    #     if os.path.exists('test.csv'):
    #         os.remove('test.csv')
    
if __name__ == '__main__':
    unittest.main()
