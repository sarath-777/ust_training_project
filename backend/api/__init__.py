Here's the step-by-step guide to implement the new feature:

**1. Which files need modifications?**

* `backend/api/admin.py`
* `backend/api/apps.py`
* `backend/api/migrations/0001_initial.py`

**2. What changes should be made?**

a. In `backend/api/admin.py`, add a new welcome message to the home screen:
```python
from django.contrib import messages

# ...

def welcome_message(request):
    messages.success(request, 'Welcome to our website!')
```
b. In `backend/api/apps.py`, update the `ApiConfig` class to include the welcome message:
```python
from django.urls import path, include

class ApiConfig(AppConfig):
    # ...

    def ready(self):
        from django.contrib import messages
        messages.success(self.get_model('Profile'), 'Welcome to our website!')
```
c. In `backend/api/migrations/0001_initial.py`, add a new field to the `Profile` model to store the welcome message:
```python
class Migration(migrations.Migration):

    # ...

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                # ...
                ('welcome_message', models.TextField(max_length=100, blank=True, null=True)),
            ],
        ),
    ]
```
d. In `backend/api/migrations/0002_alertevent.py`, update the `AlertEvent` model to include a foreign key to the `Profile` model:
```python
class Migration(migrations.Migration):

    # ...

    operations = [
        migrations.CreateModel(
            name='AlertEvent',
            fields=[
                # ...
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Profile')),
            ],
        ),
    ]
```
**3. Any additional dependencies or configurations required?**

None. The changes are straightforward and do not require any additional dependencies or configurations.