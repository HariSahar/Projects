from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from api.models import CustomUserModel

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = CustomUserModel 
        fields = ('username', 'email','ROLES','Mobile_No','password1', 'password2') 

class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = CustomUserModel
        fields = ('username', 'email','ROLES')  
