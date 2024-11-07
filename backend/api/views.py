

# Create your views here.

from functools import partial
from urllib import response
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import (UserSerializer, ProfileSerializer,AlertSerializer,
CustomTokenObtainPairSerializer,
AdminProfileSerializer,
ResidenceSerializer


)
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Profile, AlertEvent, Residence

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]

class CreateAdminView(generics.CreateAPIView):
    queryset=User.objects.all()
    serializer_class=AdminProfileSerializer
    permission_classes=[AllowAny]
    



class UserOperations(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request,pk=None):
        if pk==None:
            userobj=Profile.objects.all()
            serializer=ProfileSerializer(userobj,many=True)
            return Response(serializer.data)
        userobj=Profile.objects.get(user_id=pk)
        serializer=ProfileSerializer(userobj,many=False)
        return Response(serializer.data)
    def delete(self,request,pk):
        userobj=Profile.objects.get(pk=pk)
        userobj.delete()
        users=Profile.objects.all()
        serializer=ProfileSerializer(users,many=True)
        return Response(serializer.data)
    def patch(self,request,pk):
        userobj=Profile.objects.get(pk=pk)
        serializer=ProfileSerializer(userobj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# to get and create new events or alerts
class ResidenceGetDetailView(APIView):
    permission_classes=[AllowAny]
    def get(self,request):
        resobj=Residence.objects.all()
        serializer = ResidenceSerializer(resobj,many=True)
        return Response(serializer.data)
class ResidenceOperationsView(APIView):
    def patch(self,request,pk):
        resobj=Residence.objects.get(id=pk)
        serializer=ResidenceSerializer(resobj,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self,request,pk):
        resobj=Residence.objects.get(id=pk)
        resobj.delete()
        resobj=Residence.objects.all()
        serializer=ResidenceSerializer(resobj,many=True)
        return Response(serializer.data)

class EventView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        events=AlertEvent.objects.all()
        serializer=AlertSerializer(events,many=True)
        return Response(serializer.data)
    def post(self,request):
        serializer = AlertSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#to be able to update , delete the events or alerts
class EventoperView(APIView):
    permission_classes=[IsAuthenticated]
    def patch(self,request,pk):
        event=AlertEvent.objects.get(pk=pk)
        serializer = AlertSerializer(event,data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self,request,pk):
        event=AlertEvent.objects.get(pk=pk)
        event.delete()
        remevents=AlertEvent.objects.all()
        serializer=AlertSerializer(remevents,many=True)
        return Response(serializer.data)



#This is a custome view to implement the customisation
#of the token obtain pair view usingg the serializer
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

#Below are the CRUD operations for residence groups and membership tables:

from .models import ResidenceGroup, Membership
from .serializers import ResidenceGroupSerializer, MembershipSerializer

# CRUD for ResidenceGroup
class ResidenceGroupListCreateView(generics.ListCreateAPIView):
    queryset = ResidenceGroup.objects.all()
    serializer_class = ResidenceGroupSerializer
    permission_classes = [IsAuthenticated]

class ResidenceGroupDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ResidenceGroup.objects.all()
    serializer_class = ResidenceGroupSerializer
    permission_classes = [IsAuthenticated]

# CRUD for Membership
class MembershipListCreateView(generics.ListCreateAPIView):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [IsAuthenticated]

class MembershipDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [IsAuthenticated]




