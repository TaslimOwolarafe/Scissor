from flask import Flask
from flask_cors import CORS, cross_origin
from flask_restx import Api
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

import sqlalchemy as sa
from .models.links import Url, Hit
from .models.users import User

from .config.config import config_dict
from .utils import db

from .auth.views import user_namespace
from .links.views import links_namespace

def create_app(config=config_dict['dev']):
    app = Flask(__name__)
    app.config.from_object(config)
    app.config['PROPAGATE_EXCEPTIONS'] = True
    CORS(app, supports_credentials=True)

    # @app.after_request
    # def after_request(response):
    #     response.headers.add('Access-Control-Allow-Origin', '*')
    #     response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    #     response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    #     return response
    
    db.init_app(app)

    engine = sa.create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
    inspector = sa.inspect(engine)
    if not inspector.has_table("users"):
        with app.app_context():
            db.drop_all()
            db.create_all()
            app.logger.info('Initialized the database!')
    else:
        app.logger.info('Database already contains the users table.')


    authorizations = {
        "Bearer Auth": {
            "type": "apiKey",
            "in": "header",
            "name": "Authorization",
            "description": "Add a JWT token to the header with ** Bearer &lt;JWT&gt; ** token to authorize"
        }
    }

    jwt = JWTManager(app)

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        identity = jwt_data["sub"]
        return User.query.filter_by(id=identity).one_or_none()
    
    migrate = Migrate(app, db, render_as_batch=True)
    api = Api(app, title="SCISSORS API",
    description="URL SHORTENER",
    authorizations=authorizations,
    security="Bearer Auth")

    api.add_namespace(user_namespace)
    api.add_namespace(links_namespace)
    
    @app.shell_context_processor
    def make_shell_context():
        return {
            'db': db
        }

    return app