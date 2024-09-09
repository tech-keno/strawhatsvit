from flask import Flask, session, redirect, url_for, request, render_template_string
from flask_session import Session

app = Flask(__name__)

# Configure session to use filesystem (you can also use Redis or other backends)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = 'your_secret_key'  # Change this to a strong secret key
Session(app)

# In-memory user storage (replace with database in real applications)
users = {
    'user1': 'password1',
    'user2': 'password2'
}

# Simple HTML templates
login_template = '''
    <form method="POST" action="/login">
        Username: <input type="text" name="username"><br>
        Password: <input type="password" name="password"><br>
        <input type="submit" value="Login">
    </form>
'''

home_template = '''
    <h1>Welcome, {{ session['username'] }}!</h1>
    <a href="/logout">Logout</a>
'''

@app.route('/')
def home():
    if 'username' in session:
        return render_template_string(home_template)
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        if username in users and users[username] == password:
            session['username'] = username
            return redirect(url_for('home'))
        else:
            return 'Invalid credentials'
    
    return render_template_string(login_template)

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
