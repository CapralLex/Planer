from django.db import models
from django.contrib.auth.models import User


class Task(models.Model):
    text = models.CharField(max_length=256)
    is_complete = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.text
