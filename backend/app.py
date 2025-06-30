from flask import Flask
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from backend.config import Config
from backend.models import db
from backend.routes import api_blueprint
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/*": {"origins": "*"}})

    db.init_app(app)
    migrate = Migrate(app, db)
    jwt = JWTManager(app)

    app.register_blueprint(api_blueprint)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
