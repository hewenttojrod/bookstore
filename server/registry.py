"""Module registration metadata for bookstore."""

from src.registry.module_registration import ModuleRegistration


MODULE_REGISTRATION = ModuleRegistration(
    name="bookstore",
    app_config="server.apps.bookstore_config",
    urls="server.urls",
    api_router="server.api_urls",
)
