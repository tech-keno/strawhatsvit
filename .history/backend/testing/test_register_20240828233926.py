def test_register_user(client):
    client, db = client
    response = client.post('/register', data={'username': 'testuser', 'password': 'testpass'})
    assert response.status_code == 302  # Redirect to login
    assert db.users.find_one({'username': 'testuser'}) is not None