from django.http import HttpResponse

def home(request):
    return HttpResponse("Calculator app is working")
