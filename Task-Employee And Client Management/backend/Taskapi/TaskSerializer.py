from rest_framework import serializers
from .models import Task,Task_Details
from api.models import CustomUserModel
from CustomerApi.models import Customers
class UserNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUserModel
        fields = ['username']

class TaskSerializers(serializers.ModelSerializer):
    username = UserNameSerializer(many=True, read_only=True)
    OrganisationName = serializers.CharField(source='OrganisationName.OrganisationName', read_only=True) 

    class Meta:
        model = Task
        fields = '__all__'

    def create(self, validated_data):
        task = Task.objects.create(**validated_data)
        return task
    
    def update(self, instance, validated_data):
        # user_ids = validated_data.pop('user_ids', [])
        # instance.username.clear()  # Clear existing usernames
        
        # Add new usernames based on user_ids
        for user_id in validated_data.get('user_ids', []):  # Add new usernames based on user_ids:
            try:
                user = CustomUserModel.objects.get(id=user_id)
                instance.username.add(user)
            except CustomUserModel.DoesNotExist:
                continue  # Skip if user does not exist

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

class TaskDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task_Details
        fields = [
            'id',  
            'task',
            'username',
            'TimeIn',
            'TimeOut',
            'FreightCharges',
            'UsedItems',
            'ReturnedItems',
            'NatureOfWork',
            'AdditionalTask',
            'REMARKS',
        ]


