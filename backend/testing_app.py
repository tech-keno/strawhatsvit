import unittest
from app import app, client, db, users_collection 
from bson.objectid import ObjectId
import os
from io import StringIO
import pandas as pd
from algo import algo, make_classes


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
        self.assertIn(response.status_code, [200, 302], f"Unexpected status code: {response.status_code}")
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
    
    
    
    def test_update_document(self):
        """
        Testing Update Document

        Purpose: To verify that a document can be successfully updated in the database.

        Setup: A sample document is inserted into the database e.g Old Name and Old Description. The test will simulate an HTTP PUT request to the /document/name/<name> route

        Execution: The test will send a put request to the specified route and check the sample documment, hence updating it with thew new description



        Expected Outcome: The response should contain a message saying that the document was successfully updates, and the status code should be 200, aswell as the database being updated to reflect the new document.

        """
        self.db.mycollection.insert_one({"name": "Old Name", "description": "Old Description"})
        
        response = self.client.put('/document/name/Old Name', json={"description": "New Description"})
        self.assertEqual(response.status_code, 200)
        
        updated_doc = self.db.mycollection.find_one({"name": "Old Name"})
        self.assertEqual(updated_doc["description"], "New Description")
    
    def test_delete_document(self):
        """
        Testing Delete Document

        Purpose: To verify that a document can be successfully deleted from the database.

        Setup: A sample document is inserted into the database e.g Delete me. The test will simulate an HTTP DELETE request to the /document/<doc_id> route

        Execution: The test will send a put request to the specified route and delete the document with valid id, the test will then check the response to ensure it was successful.

        Expected Outcome: The response should contain a message which indicates that the document was sucessfully deleted, the response code should be 200.

        """
        result = self.db.mycollection.insert_one({"name": "Delete Me"})
        doc_id = str(result.inserted_id)
        
        response = self.client.delete(f'/document/{doc_id}')
        self.assertEqual(response.status_code, 200)
        
        self.assertIsNone(self.db.mycollection.find_one({"_id": ObjectId(doc_id)}))
    
    def test_upload_file(self):
        """
        Testing Upload Document

        Purpose: To verify that a document can be successfully uploaded and saved in the root folder.

        Setup: the test will simulate an http POST request to the /upload route

        Execution: The test will send a POST request to the /upload route with a valid test file, which will the be checked to see if the resposne is sucessful and the document was uploaded.

        Expected Outcome: The response should contain a message which indicates that the document was sucessfully uploaded, the response code should be 200. The file should also be found in the route folder.
        """
        with open('test.csv', 'w') as f:
            f.write("name,description\nLuffy,Pirate\nZoro,Swordsman")
        
        with open('test.csv', 'rb') as f:
            response = self.client.post('/upload', data={'file': f})
            self.assertEqual(response.status_code, 200)
            self.assertIn(b'File uploaded successfully', response.data)
    
    def setUp(self):
        # Sample enrolment data for df1
        enrolment_data = StringIO("""
Student Name,MITS101,MITS102,Course Name
Alice,ENRL,ENRL,Bachelor of Science
Bob,,ENRL,Bachelor of Science
Charlie,ENRL,,Bachelor of Science
        """)
        
        # Sample classes data for df2
        classes_data = StringIO("""
Unit,Time,Lecturer,Classroom,Delivery Mode
MITS101,2,Jake,Room 101,Online
MITS102,1,Sarah,Room 102,In-Person
        """)
        
        self.df1 = pd.read_csv(enrolment_data)
        self.df2 = pd.read_csv(classes_data)

    def test_make_classes(self):
        expected_output = {
            "MITS101": {
                "students": {"Alice", "Charlie"},
                "length": 2,
                "delivery_mode": "Online",
                "classroom": "Room 101",
                "course": "Bachelor of Science"
            },
            "MITS102": {
                "students": {"Alice", "Bob"},
                "length": 1,
                "delivery_mode": "In-Person",
                "classroom": "Room 102",
                "course": "Bachelor of Science"
            }
        }

    

        result = make_classes(self.df1, self.df2)
        self.assertEqual(result, expected_output)


    # def clean_up(self):
    #     # delete everything in databases and uploads
    #     self.db.mycollection.delete_many({})
    #     self.users_collection.delete_many({})
    #     if os.path.exists('test.csv'):
    #         os.remove('test.csv')
    
if __name__ == '__main__':
    unittest.main()
