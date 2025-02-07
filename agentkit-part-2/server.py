from random import randint
from flask import Flask, jsonify
from flask_cors import CORS
from my_agent import firstStory, secondStory

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

story = 1

@app.route("/index", methods=["GET"])
def generateIndex():
    global story
    story = randint(1, 3)
    print(story)
    return jsonify({"index": story})

@app.route('/first', methods=['GET'])
def getFirstStory():
    global story
    result = firstStory(story - 1)
    result = result.strip().split(". ")
    return jsonify(result)

@app.route('/second', methods=['GET'])
def getSecondStory():
    global story
    result = secondStory(story - 1)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
