import requests
import base64
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/colorize', methods=['POST'])
def colorize():
    image = request.json['image']
    image_data = base64.b64decode(image.split(',')[1])
    
    with open("temp_sketch.png", "wb") as f:
        f.write(image_data)

    response = requests.post(
        "https://api.deepai.org/api/colorizer",
        files={"image": open("temp_sketch.png", "rb")},
        headers={"api-key": DEEPAI_API_KEY}
    )

    result = response.json()
    return jsonify({"colored_image": result["output_url"]})

if __name__ == '__main__':
    app.run(debug=True)
