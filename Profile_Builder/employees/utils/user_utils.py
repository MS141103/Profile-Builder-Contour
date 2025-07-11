from django.contrib.auth.models import User

def create_user_account(user_data):
    return User.objects.create_user(
        username=user_data['username'],
        email=user_data['email'],
        password=user_data['password']
    )
