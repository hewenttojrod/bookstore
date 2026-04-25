from core._models.base_model import BaseModel
from core.src.util.str_utils import strs_to_numeric_code
from django.db import models


class Book(BaseModel):
    
    class book_genre(models.TextChoices):
        #       code   desc    
        FIC =   "fic", "Fiction"
        SCI =   "sci", "Science Fiction"
        FAN =   "fan", "Fantasy"
        ADV =   "adv", "Action Adventure"
        HIS =   "his", "Historical Fiction"
        ROM =   "rom", "Romance"

    #db fields
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    genre = models.CharField(
        null=True, max_length=20, choices=book_genre.choices
    )
    author = models.CharField(max_length=250)
    #stands for scuffed book number code, my bad version of ISBN 
    #code is genre code - title+author
    sbn_code = models.CharField(max_length=50)


    def save(self, *args, **kwargs):

        if (not self.sbn_code):
            self.sbn_code = self.genre + strs_to_numeric_code(self.author, self.title, length=10)
    
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f'{self.title} - {self.sbn_code}'