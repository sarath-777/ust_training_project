**Step-by-Step Guide:**

**1. Which files need modifications?**

* `backend/api/admin.py`
* `backend/api/apps.py`
* `backend/api/migrations/0001_initial.py`
* `backend/api/migrations/0002_alertevent.py`
* `backend/api/__init__.py` (to include a new app)

**2. What changes should be made?**

**backend/api/admin.py:**
Add a new model to the admin site:
```python
from django.contrib import admin
from .models import WelcomeMessage

admin.site.register(WelcomeMessage)
```
**backend/api/apps.py:**
Create a new app for the welcome message:
```python
from django.apps import AppConfig


class WelcomeConfig(AppConfig):
    name = 'welcome'
    verbose_name = 'Welcome Message'
```
**backend/api/migrations/0001_initial.py:**
Add the welcome message model:
```python
class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('api', '0002_alertevent'),
    ]

    operations = [
        migrations.CreateModel(
            name='WelcomeMessage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField(max_length=200)),
            ],
        ),
    ]
```
**backend/api/migrations/0002_alertevent.py:**
No changes needed.

**backend/api/__init__.py:**
Add the new app to the `INSTALLED_APPS` list:
```python
default_app_config = 'api.apps.ApiConfig'
INSTALLED_APPS = [
    ...
    'welcome.apps.WelcomeConfig',
    ...
]
```
**3. Any additional dependencies or configurations required?**

* None

Note: The welcome message model will store a simple text message. You may want to add additional fields or functionality depending on your requirements.