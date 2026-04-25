from ninja import ModelSchema, Schema
from .model import Book


class BookSchema(ModelSchema):
    class Meta:
        model = Book
        fields = "__all__"

class BookSchemaCreate(Schema):
    title: str
    description: str
    genre: Book.book_genre
    author: str
    sbn_code: str = ""

class BookSchemaUpdate(Schema):
    class Meta:
        model = Book
        exclude = ["updated_at", "created_at"] #TODO: have a core list populated by core server


class BookGenreOptionSchema(Schema):
    value: str
    label: str
