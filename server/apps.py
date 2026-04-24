from django.apps import AppConfig
from .registry import MODULE_REGISTRATION as module


class bookstore_config(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = f"{module.name}.server"
