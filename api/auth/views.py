from flask import request, abort, jsonify
from flask_cors import cross_origin
from flask_restx import Namespace, Resource, fields, cors
from http import HTTPStatus
from ..models.users import User
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, create_refresh_token, get_jwt_header, get_jwt_identity, current_user

user_namespace = Namespace('users', description='users and authentication')

user_base_model = user_namespace.model('User Base',
    {'id': fields.Integer(dump_only=True),
    'email': fields.String(required=True)})

signup_model = user_namespace.model('signup',
    {'email': fields.String(required=True),
    'password': fields.String(required=True)})

login_model = user_namespace.model('Login',{
    'email':fields.String(required=True),
    'password':fields.String(required=True)
})

@user_namespace.route('/signup')
class SignUp(Resource):
    @user_namespace.expect(signup_model)
    @user_namespace.doc(description="Sign Up")
    def post(self):
        """
            Sign Up
        """
        data = request.get_json()
        user_ex = User.query.filter(User.email==data['email']).first()
        if user_ex:
            abort(401, "Email already used by another user.")
        if data['password'] != data['confirm']:
            abort(400, "passwords don't match.")
        user = User.create_user(email=data['email'], password=data['password'])
        return {'message': 'user created',
            'data':user_namespace.marshal(user, user_base_model)}, HTTPStatus.CREATED
    
@user_namespace.route("/login")
class LoginView(Resource):
    @user_namespace.doc(responses={200: 'OK'})
    @user_namespace.expect(login_model)
    def post(self):
        data = request.get_json()
        user = User.query.filter(User.email==data['email']).first()
        if user and pbkdf2_sha256.verify(data['password'], user.password):
            access_token=create_access_token(identity=user.id)
            refresh_token=create_refresh_token(identity=user.id)
            response = {
                'user_id': user.id,
                'access_token':access_token, 
                "refresh_token":refresh_token,
                "message":"login successul"
            }
            return response, HTTPStatus.OK
        abort(401, "invalid credentials.")

@user_namespace.route("/refresh")
class TokenRefresh(Resource):
    @jwt_required(refresh=True)
    @user_namespace.doc(description="Refresh an access Token")
    def post(self):
        user = current_user
        new_token = create_access_token(identity=user,fresh=False)
        jti = get_jwt()['jti']
        return {'access_token':new_token}, HTTPStatus.OK