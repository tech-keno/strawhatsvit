import unittest
import json
from app import app  # Assuming your app's name is app.py
from unittest.mock import patch
from pymongo.collection import Collection

class GetDocumentsTestCase(unittest.TestCase):
    def setUp(self):
        # Setup test client
        self.app = app.test_client()
        self.app.testing = True

    @patch.object(Collection, 'find')
    def test_get_documents(self, mock_find):
        # Mock the response from the database
        mock_find.return_value = [
            {"name": "Document1", "description": "This is document 1"},
            {"name": "Document2", "description": "This is document 2"}
        ]
        
        # Make a GET request to the /documents endpoint
        response = self.app.get('/documents')

        # Check the response status code
        self.assertEqual(response.status_code, 200)

        # Parse the response data
        data = json.loads(response.data.decode('utf-8'))

        # Check that the data matches the mocked data
        expected_data = [
            {"name": "Document1", "description": "This is document 1"},
            {"name": "Document2", "description": "This is document 2"}
        ]
        
        self.assertEqual(data, expected_data)

if __name__ == '__main__':
    unittest.main()