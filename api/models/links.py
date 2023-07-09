from ..utils import db
from datetime import datetime


class Url(db.Model):
    __tablename__ = 'urls'

    id = db.Column(db.Integer(), primary_key=True)
    user = db.Column(db.Integer(), db.ForeignKey('users.id'))
    target = db.Column(db.String(10000), nullable=False)
    url_id = db.Column(db.String(), unique=True)
    
    hit_count = db.Column(db.Integer(), default=0)
    title = db.String()
    hits = db.relationship('Hit', backref='_url', lazy='dynamic')
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, onupdate=datetime.now)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

class Hit(db.Model):
    __tablename__ = "hits"

    id = db.Column(db.Integer(), primary_key=True)
    url = db.Column(db.Integer(), db.ForeignKey('urls.id'))
    ip = db.Column(db.String())
    timezone_name = db.Column(db.String())
    timezone_offset = db.Column(db.Integer())
    timezone_id = db.Column(db.String())
    timezone_abbrv = db.Column(db.String())
    location_name = db.Column(db.String())
    location_city = db.Column(db.String())
    location_postal = db.Column(db.String())
    location_country_name = db.Column(db.String())
    location_country_code = db.Column(db.String())
    location_continent_name = db.Column(db.String())
    location_continent_code = db.Column(db.String())
    browser_name = db.Column(db.String())
    browser_version = db.Column(db.String())
    os_name = db.Column(db.String())
    os_version = db.Column(db.String())

    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, onupdate=datetime.now)

    def save(self):
        db.session.add(self)
        db.session.commit()