from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

with app.app_context():
    from letterjam import letterjam as letterjam_blueprint

    app.register_blueprint(letterjam_blueprint, url_prefix='/api')
