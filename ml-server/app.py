from flask import Flask
from flask_cors import CORS
from services.live_vision import live_vision_bp
from routes.health import health_bp
from routes.vision import vision_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(health_bp)
app.register_blueprint(vision_bp)

app.register_blueprint(live_vision_bp)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)