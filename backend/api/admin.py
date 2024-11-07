from django.contrib import admin

from api.models import Profile, ResidenceGroup

# Register your models here.
admin.site.register(ResidenceGroup)
admin.site.register(Profile)