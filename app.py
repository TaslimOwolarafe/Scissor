from .api import create_app, config_dict

app = create_app(config=config_dict['prod'])