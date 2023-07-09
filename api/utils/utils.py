import urllib
import validators
from validators import ValidationFailure
from flask_restx import abort

def b_to_dict(byte_string):
    decoded_string = byte_string.decode('utf-8')
    parsed_dict = urllib.parse.parse_qs(decoded_string)

    result_dict = {key: value[0] for key, value in parsed_dict.items()}
    return result_dict

def validate_url(url):
    valid = validators.url(url)
    if isinstance(valid, ValidationFailure):
        abort(400, message='url not valid. Enter a valid url')
    return url