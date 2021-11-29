from flask import Flask


def create_app():
    app = Flask(__name__)
    with app.app_context():

        from .letterjam import letterjam as letterjam_blueprint
        app.register_blueprint(letterjam_blueprint)

    return app
