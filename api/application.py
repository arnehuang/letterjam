from flask import Flask

app = Flask(__name__)

with app.app_context():
    from letterjam import letterjam as letterjam_blueprint
    app.register_blueprint(letterjam_blueprint, url_prefix='/api')
