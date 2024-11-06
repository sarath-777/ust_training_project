from xml.etree.ElementInclude import default_loader
from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    isAdmin=models.BooleanField(default=False, help_text='Check This Box if you are the admin of any residence')
   
    Residence = models.CharField(max_length=100)

    
    bio = models.TextField(blank=True, null=True)
    isVerified = models.BooleanField(default=False, help_text='This field is checked by the admin and only when the admin checks this field a user can login to the portal')

    def __str__(self):
        return self.user.username



class AlertEvent(models.Model):
    Title = models.TextField(max_length=100)
    Residence = models.TextField(max_length=100)
    Event= models.BooleanField(default=True ,help_text="if unchecked means its an alert else its an event")
    Date = models.DateField()
    Time = models.TimeField()
    Description = models.TextField(max_length=300)



#Models for Residence Groups and Membership 


class ResidenceGroup(models.Model):
    

    title = models.CharField(max_length=100)  # Title of the group
    residence = models.CharField(max_length=100)  # Name of the residence
    members = models.ManyToManyField(User, through='Membership')  # Link to User with an intermediary table
    
    def __str__(self):
        return self.title


class Membership(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Link to User
    group = models.ForeignKey(ResidenceGroup, on_delete=models.CASCADE)  # Link to ResidenceGroup

    class Meta:
        unique_together = ('user', 'group')  # Ensure a user can only be in a group once

    def __str__(self):
        return f"{self.user.username} - {self.group.title}"



