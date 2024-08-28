def test_register_user(client):
    client, db = client
    response = client.post('/register', data={'username': 'testing123321', 'password': 'testingpassword123321'})
    assert response.status_code == 302  
    assert db.users.find_one({'username': 'testuser'}) is not None