from django.urls import path

from .books.book_api import app


urlpatterns = [
    path("", app.urls),
]
