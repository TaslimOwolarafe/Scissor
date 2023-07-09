import random, string, validators
from validators import ValidationFailure
from flask import request, Response
from flask_jwt_extended import jwt_required, get_jwt_identity, current_user
from flask_cors import cross_origin

from ..utils import db
from ..utils.utils import b_to_dict, validate_url
from ..models.links import Url, Hit
from ..models.users import User

from flask_restx import Resource, Namespace, fields, abort, cors
from http import HTTPStatus

links_namespace = Namespace('links', description="Links Namespace")

url_model = links_namespace.model(
    'Urls', {
        'id': fields.Integer(dump_only=True),
        'user': fields.Integer(),
        'target': fields.String(),
        'url_id': fields.String(),
        'hit_count': fields.Integer(),
        'title': fields.String(),
        'created_at': fields.DateTime(dump_only=True),
        'updated_at': fields.DateTime(dump_only=True)
    }
)

url_create = links_namespace.model(
    'Url Create', {
        'target': fields.String(required=True),
        'title': fields.String()
    }
)

hit_model = links_namespace.model(
    'Hits', {
        'id': fields.Integer(dump_only=True),
        'url': fields.Integer(),
        'ip': fields.String(),
        'timezone_name': fields.String(),
        'timezone_offset': fields.String(),
        'timezone_id': fields.String(),
        'timezone_abbrv': fields.String(),
        'timezone_name': fields.String(),
        'location_city': fields.String(),
        'location_postal': fields.String(),
        'location_country_name': fields.String(),
        'location_country_code': fields.String(),
        'location_continent_name': fields.String(),
        'location_continent_code': fields.String(),
        'browser_name': fields.String(),
        'browser_version': fields.String(),
        'os_name': fields.String(),
        'os_version': fields.String(),
        'created_at': fields.String(dump_only=True),
        'updated_at': fields.String(dump_only=True)
    }
)

url_hits = links_namespace.model(
    "Url Hits", {
        'user': fields.Integer(),
        'target': fields.String(),
        'url_id': fields.String(),
        'hit_count': fields.Integer(),
        'title': fields.String(),
        'created_at': fields.DateTime(dump_only=True),
        'hits': fields.Nested(hit_model)
    }
)

@links_namespace.route('/create')
class UrlCreateView(Resource):
    @jwt_required()
    @links_namespace.expect(url_create)
    @links_namespace.marshal_with(url_model)
    @links_namespace.doc(description="create a url")
    def post(self):
        data = request.get_json()
        user = current_user.id
        title = data['title']
        try:
            target = validate_url(data['target'])
        except:
            abort(400, message='url not valid. Enter a valid url')
        url_id = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits + string.ascii_lowercase) for _ in range(7))
        url = Url(user=user, target=target, url_id=url_id, title=title)
        url.save()
        return url, HTTPStatus.CREATED
    
@links_namespace.route('/<string:url_id>')
class UrlRequest(Resource):
    @links_namespace.marshal_with(url_model)
    def get(self, url_id):
        data = request.get_json()
        url = Url.query.filter(Url.url_id==url_id).first()
        if not url:
            abort(404, message='Not found.')
        return url, HTTPStatus.OK
    
    @links_namespace.expect(hit_model)
    @links_namespace.marshal_with(url_model)
    def post(self, url_id):
        data = request.get_json()
        url = Url.query.filter(Url.url_id==url_id).first()
        if not url:
            abort(404, message='Not found.')
        url.hit_count +=1
        url.save()
        hit = Hit(url=url.id,**data)
        hit.save()
        return url, HTTPStatus.OK
    
    @links_namespace.marshal_with(url_model)
    def delete(self, url_id):
        data = request.get_json()
        url = Url.query.filter(Url.url_id==url_id).first()
        if not url:
            abort(404, message='Not found.')
        return {'message':'deleted successfully.'}, HTTPStatus.ok
    
    
    @links_namespace.expect(url_create)
    @links_namespace.marshal_with(url_model)
    def put(self, url_id):
        data = request.get_json()
        url = Url.query.filter(Url.url_id==url_id).first()
        if not url:
            abort(404, message='Not found.')
        target = validate_url(data['target'])
        url.target = target
        url.title = data['title']
        url.save()
        return {'message':'edited successfully.'}, HTTPStatus.OK
     

@links_namespace.route('/<string:url_id>/hits/status')
class UrlRequest(Resource):
    @jwt_required()
    @links_namespace.marshal_with(url_hits)
    def get(self, url_id):
        url = Url.query.filter(Url.url_id==url_id).first()
        if not url_id:
            return {'message': 'Not found.'}, HTTPStatus.BAD_REQUEST
        return url, HTTPStatus.OK
    
@links_namespace.route('/all')
class UrlRequest(Resource):
    @jwt_required()
    @links_namespace.marshal_with(url_model)
    def get(self):
        url = Url.query.filter(Url.user==current_user.id).all()
        # if not url_id:
        #     return {'message': 'Not found.'}, HTTPStatus.BAD_REQUEST
        return url, HTTPStatus.OK
    
@links_namespace.route('/hit/create/<string:url_id>')
class HitCreate(Resource):
    @links_namespace.expect(hit_model)
    @links_namespace.marshal_with(url_model)
    def post(self, url_id):
        data = request.get_json()
        url = Url.query.filter(Url.url_id==url_id).first()
        if not url:
            abort(404, message='Not found.')
        url.hit_count +=1
        url.save()
        hit = Hit(**data)
        hit.save()
        return url, HTTPStatus.OK