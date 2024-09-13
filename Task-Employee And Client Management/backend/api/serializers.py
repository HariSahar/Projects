from rest_framework import serializers
from .models import CustomUserModel

#Serializers for CRUD Operations
from rest_framework import serializers
from django.contrib.auth.hashers import make_password

class EmployeeSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUserModel
        fields = ['id', 'username', 'Mobile_No', 'ROLES', 'email', 'password1', 'password2']

    extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        attrs['password'] = make_password(attrs['password1'])

        return attrs



#Serizlizers for getting username
class EmpNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUserModel
        fields = ['id','username']

class getEmpNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUserModel
        fields = ['id', 'username']  
    emp_id = serializers.IntegerField(source='id', read_only=True)
    emp_name = serializers.CharField(source='usernameName', read_only=True)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return {
            "id": representation['id'],
            "Name": representation['usernameName']
        }

