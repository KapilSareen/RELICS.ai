from flask import Flask, jsonify
from my_agent import firstStory, secondStory
app = Flask(__name__)

@app.route('/first', methods=['GET'])
def getFirstStory():
    result = firstStory()
    return jsonify(result)

@app.route('/second', methods=['GET'])
def getSecondStory():
    result = secondStory()
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
