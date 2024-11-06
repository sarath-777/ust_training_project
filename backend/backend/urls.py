"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from api.views import (CreateUserView,  EventView, EventoperView,UserOperations,CustomTokenObtainPairView,
    ResidenceGroupListCreateView,
    ResidenceGroupDetailView,
    MembershipListCreateView,
    MembershipDetailView,
    CreateAdminView)
from rest_framework_simplejwt.views import  TokenRefreshView


    
urlpatterns = [
    path('admin/', admin.site.urls),
    #to register admin
    path('api/admin/register/',CreateAdminView.as_view(),name="admin_registration"),
    path('api/user/register/',CreateUserView.as_view(), name="register"),
    path('api/token/',CustomTokenObtainPairView.as_view(),name='get_token'),
    path('api/token/refresh/',TokenRefreshView.as_view(),name='refresh'),
    path('api/events/',EventView.as_view(),name='newEvents'),
    path('api/events/makechanges/<int:pk>/',EventoperView.as_view(),name='event_changes'),
    path('api/admin/useroperations/<int:pk>/',UserOperations.as_view(),name='user_updation'),
    path('api/admin/useroperations/',UserOperations.as_view(),name='getAllUsers'),
    

    #paths to residence group and memebership crud operations:
    path('residence-groups/', ResidenceGroupListCreateView.as_view(), name='residence-group-list-create'),
    path('residence-groups/<int:pk>/', ResidenceGroupDetailView.as_view(), name='residence-group-detail'),
    path('memberships/', MembershipListCreateView.as_view(), name='membership-list-create'),
    path('memberships/<int:pk>/', MembershipDetailView.as_view(), name='membership-detail'),
    

]
