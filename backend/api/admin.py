from django.contrib import admin
from .models import ResidenceGroup, Profile

from api.models import Profile, ResidenceGroup

# Register your models here.
admin.site.register(ResidenceGroup)
admin.site.register(Profile)