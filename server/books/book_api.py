from ninja import NinjaAPI
from .model import Book
from .book_api_schema import BookGenreOptionSchema, BookSchema, BookSchemaCreate, BookSchemaUpdate
from django.shortcuts import get_object_or_404
app = NinjaAPI(urls_namespace="bookstore_api", docs_url="/docs")



@app.get("book_list/", response=list[BookSchema])
def get_book_list(request):
    """
        Return all books.
    """
    return Book.objects.all()


@app.get("book/", response=BookSchema)
def get_book(request, id: int):
    """
        Return a single book by primary key.
    """
    book = get_object_or_404(Book, book_id=id)
    # if not book:
    #     return 404, {'message', f'Book with id {id} not found'}
    return book


@app.get("book/book_genres/", response=list[BookGenreOptionSchema])
def get_book_genres(request):
    """
        Return valid genre options from the Book model choices.
    """
    return [
        {"value": value, "label": label}
        for value, label in Book.book_genre.choices
    ]


@app.post("book/", response=BookSchema)
def create_book(request, book: BookSchemaCreate):
    """
        Create a new book entry.
    """
    book_data = book.model_dump()
    new_book = Book.objects.create(**book_data)
    return new_book

@app.put("book/", response=BookSchema)
def update_book(request, id: int, book: BookSchemaUpdate):
    """
        update book entry.
    """
    updating_book = get_object_or_404(Book, book_id=id)
    for attr, value in book.dict().items():
        if(getattr(updating_book, attr) != value):
            setattr(updating_book, attr, value)
    updating_book.save()
    return {"success": True}

@app.delete("book/")
def delete_book(request, id: int):
    """
        delete book if it exists
    """
    book = get_object_or_404(Book, book_id=id)

    if not book:
        return {"success": False}
    
    book.delete()

    return {"success": True}
