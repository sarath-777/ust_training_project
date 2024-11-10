

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

from twilio.rest import Client

# Twilio credentials
TWILIO_ACCOUNT_SID ='AC05350cafb0044d278748111b8640116f' #'your_twilio_account_sid'
TWILIO_AUTH_TOKEN = '35ec68ac25a822fb2e60f3bfc52d2070'#'your_twilio_auth_token'
TWILIO_WHATSAPP_NUMBER = 'whatsapp:+14155238886'  # This is Twilio's sandbox number

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
        userobj=Profile.objects.get(user_id=pk)
        userobj.delete()
        users=Profile.objects.all()
        serializer=ProfileSerializer(users,many=True)
        return Response(serializer.data)
    def patch(self,request,pk):
        userobj=Profile.objects.get(user_id=pk)
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

    def get(self,request,pk=None):
        if pk:
<<<<<<< HEAD
            events=AlertEvent.objects.get(pk=pk)
            serializer=AlertSerializer(events, partial=True)
=======
            events=AlertEvent.objects.get(id=pk)
            serializer=AlertSerializer(events,partial=True)
>>>>>>> chat
            return Response(serializer.data)
        events=AlertEvent.objects.all()
        serializer=AlertSerializer(events,many=True)
        return Response(serializer.data)
    def post(self,request):
        serializer = AlertSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            
            print ("printing ...:",serializer.data['Residence'])
            residence_id = serializer.data['Residence']
            message_text = serializer.data['Description']
            title = serializer.data['Title']
            client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

            phone_numbers= Profile.objects.filter(Pincode_id=residence_id).values_list('phonenumber',flat=True)
            for number in phone_numbers:
                print("number of each person with that id is :",number)
                try:
                    message_to_sent = str(title) + " : " + str(message_text)
                    to_the_number= 'whatsapp:+91'+str(number)
                    print("the phone number in try block is :  ",to_the_number,"and the type is : ",type(to_the_number))
                    message = client.messages.create(
                        body = message_to_sent ,
                        from_ = TWILIO_WHATSAPP_NUMBER,
                        to = to_the_number

                    )
                    print("Message sent:....", message)
                except Exception as e :
                    print("failed to sent message .......")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#to be able to update , delete the events or alerts
class EventoperView(APIView):
    permission_classes=[IsAuthenticated]
    def patch(self,request,pk):
        event=AlertEvent.objects.get(id=pk)
        serializer = AlertSerializer(event,data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self,request,pk):
        event=AlertEvent.objects.get(id=pk)
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




