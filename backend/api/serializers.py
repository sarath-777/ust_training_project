from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, AlertEvent
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True) 
    class Meta:
        model = User
        fields = ['id', 'username', 'password','first_name','last_name','email']

    def create(self,validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password']) #Hash the password
        user.save()
        return user

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False)  # Make the user field optional for updates

    class Meta:
        model = Profile
        fields = ['user', 'isAdmin', 'Residence', 'bio']

    def create(self,validated_data):
        user_data= validated_data.pop('user') #extract the user data from the validated data
        user_serializer=UserSerializer(data=user_data) #initialise user serializer
        if user_serializer.is_valid():
            user = user_serializer.save()
            profile=Profile.objects.create(user=user,**validated_data) #create profile instance
            return profile
        raise serializers.validationError(user_serializer.errors)



    def update(self, instance, validated_data):
        # Update user fields if present
        user_data = validated_data.pop('user', None)  # Extract user data, if present
        if user_data:
            user = instance.user
            for field, value in user_data.items():
                setattr(user, field, value)
            if 'password' in user_data:
                user.set_password(user_data['password'])  # Handle password correctly
            user.save()

        # Update profile fields
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()  # Save profile changes

        return instance



class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertEvent
        fields ='__all__'
    





#This is a custome serializer for token pair view to make the user only be able to login if 
#is verified is set to true by the admin


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Perform the default validation first
        data = super().validate(attrs)

        # Get the user from the validated data
        user = self.user

        # Check if the user's profile is verified
        try:
            profile = Profile.objects.get(user=user)
            if profile.isAdmin:
                return data
            if not profile.isVerified:
                raise serializers.ValidationError("Your account is not verified by the admin.")
        except Profile.DoesNotExist:
            raise serializers.ValidationError("Profile does not exist.")

        # If everything is fine, return the token data
        return data


#Serializers for Residence Groups and Memberships

from .models import ResidenceGroup, Membership


class ResidenceGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResidenceGroup
        fields = ['id', 'title', 'residence', 'members']

class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = ['id', 'user', 'group']
