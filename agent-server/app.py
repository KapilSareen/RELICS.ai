import os
from functools import wraps
from flask import Flask, request, jsonify, session
from flask_session import Session
from langchain_core.messages import HumanMessage
from chatbot import initialize_agent
from flask_cors import CORS

app = Flask(__name__)

CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

app.config['SECRET_KEY'] = os.urandom(24)
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

user_agents = {}

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'public_address' not in session:
            return jsonify({"error": "Unauthorized access. Please log in."}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/register', methods=['POST'])
def register():
    
    response = jsonify({"message": "Registration successful"})

    if not request.is_json:
        return jsonify({"error": "Invalid request: JSON data expected"}), 400

    try:
        data = request.get_json()
    except Exception as e:
        return jsonify({"error": f"Failed to parse JSON: {str(e)}"}), 400

    public_address = data.get('public_address')
    if not public_address:
        return jsonify({"error": "Public address is required"}), 400

    user_file_path = f'users/{public_address}.txt'
    if os.path.exists(user_file_path):
        return jsonify({"error": "User already registered"}), 400

    try:
        os.makedirs('users', exist_ok=True)
        with open(user_file_path, 'w') as f:
            f.write(public_address)
    except Exception as e:
        return jsonify({"error": f"Failed to create user file: {str(e)}"}), 500
    
    return response, 200


@app.route('/login', methods=['POST'])
def login():
    # response = jsonify({"message": "Login successful"})
    # response.headers.add('Set-Cookie', f'session={session.sid}; HttpOnly; SameSite=None; Secure; Path=/; Partitioned;')

    data = request.get_json()
    public_address = data.get('public_address')
    if not public_address:
        return jsonify({"error": "Public address is required"}), 400

    if os.path.exists(f'users/{public_address}.txt'):
        session['public_address'] = public_address
        wallet_filename = f"wallets/wallet_{public_address}.txt"
        os.makedirs('wallets', exist_ok=True)
        session['wallet_file'] = wallet_filename
        session['score'] = 1000

        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid public address"}), 401

@app.route('/chat', methods=['POST'])
@login_required
def chat():
    public_address = session['public_address']
    print("Logged in as: ", public_address)
    wallet_file = session.get('wallet_file')
    print("Using wallet file: ", wallet_file)

    data = request.get_json()
    level = str(data.get('level', '1'))

    key = f"{public_address}_{level}"
    if key not in user_agents:
        agent_executor, config = initialize_agent(level, wallet_file)
        user_agents[key] = (agent_executor, config)
    else:
        agent_executor, config = user_agents[key]

    prompt = data.get('prompt')
    if not prompt:
        return jsonify({"error": "Missing 'prompt' in request"}), 400

    if 'score' not in session:
        session['score'] = 1000
    session['score'] = session['score'] - 1

    response_text = ""

    try:
        messages = [HumanMessage(content=prompt)]
        for chunk in agent_executor.stream({"messages": messages}, config):
            if "agent" in chunk:
                response_text += chunk["agent"]["messages"][0].content + "\n"
            elif "tools" in chunk:
                response_text += chunk["tools"]["messages"][0].content + "\n"
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"response": response_text.strip()})

@app.route('/score', methods=['GET'])
@login_required
def score():
    if 'score' not in session:
        session['score'] = 1000
    return jsonify({"score": session['score']}), 200

@app.route('/wallet_details', methods=['GET'])
@login_required
def wallet_details():
    wallet_file = session.get('wallet_file')
    if not wallet_file or not os.path.exists(wallet_file):
        return jsonify({"error": "Wallet file not found"}), 404
    with open(wallet_file, "r") as f:
        wallet_data = f.read()
    return jsonify({"wallet_details": wallet_data}), 200

@app.route('/logout', methods=['POST'])
@login_required
def logout():
    session.clear()
    return jsonify({"message": "Logout successful"}), 200

@app.route('/delete_session', methods=['DELETE'])
@login_required
def delete_session():
    public_address = session.get('public_address')
    wallet_file = session.get('wallet_file')

    if not public_address or not wallet_file:
        return jsonify({"error": "No active session found"}), 400

    if os.path.exists(wallet_file):
        os.remove(wallet_file)

    session.clear()
    return jsonify({"message": "Session and wallet file deleted successfully"}), 200

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001)
