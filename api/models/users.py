from ..utils import db
from datetime import datetime
from passlib.hash import pbkdf2_sha256


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(50), nullable=False, unique=True)
    name = db.Column(db.String(100))
    password = db.Column(db.String(64), nullable=False)
    is_superuser = db.Column(db.Boolean(), default=False)
    is_active = db.Column(db.Boolean(), default=True)
    date_joined = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, onupdate=datetime.now)


    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def normalize_email(cls, email):
        """
        Normalize the email address by lowercasing the domain part of it.
        """
        email = email or ""
        try:
            email_name, domain_part = email.strip().rsplit("@", 1)
        except ValueError:
            pass
        else:
            email = email_name + "@" + domain_part.lower()
        return email
    
    def set_password(self, raw_password):
        self.password = pbkdf2_sha256.hash(raw_password)

    @classmethod
    def create_user(self, email, password, **other_fields):
        if not email:
            raise ValueError('You must provide an email address')
        email = self.normalize_email(email)
        user = User(email=email, **other_fields)
        user.set_password(password)
        user.save()
        return user

    @classmethod
    def create_superuser(self, email, password, **other_fields):
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_active', True)

        if other_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must be assigned to is_superuser=True')

        return self.create_user(email, password, **other_fields)