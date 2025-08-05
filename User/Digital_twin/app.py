# app.py
from flask import Flask, send_file, send_from_directory
from flask_socketio import SocketIO, emit
import requests
import random

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

WEATHER_API_KEY = "8c4cc5a8d9f7aba0c37572d88ec849fb"

def generate_pois(center):
    def random_offset(): return random.uniform(-0.01, 0.01)

    def poi(name):
        return {
            "name": name,
            "coords": [center[0] + random_offset(), center[1] + random_offset()]
        }

    return {
        "homestays": [poi("Eco Lodge"), poi("Village Stay")],
        "tourist_spots": [poi("Temple Point"), poi("River View")],
        "shops": [poi("Craft Store"), poi("Local Market")]
    }

def get_weather(lat, lon):
    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}&units=metric"
        res = requests.get(url).json()
        temp = res['main']['temp']
        aqi = random.randint(40, 150)
        return temp, aqi
    except Exception as e:
        print("Weather API error:", e)
        return 25, 90

@app.route('/')
def index():
    return send_file("index.html")

@socketio.on('custom_location')
def handle_custom_location(data):
    coords = data['coords']
    name = data['name']
    lat, lon = coords[1], coords[0]
    temperature, aqi = get_weather(lat, lon)
    footfall = random.randint(10, 300)

    response = [{
        "name": name,
        "coords": coords,
        "desc": "User selected location",
        "temperature": temperature,
        "aqi": aqi,
        "footfall": footfall,
        "pois": generate_pois(coords)
    }]
    emit("village_update", response)

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

if __name__ == '__main__':
    socketio.run(app, debug=True)
