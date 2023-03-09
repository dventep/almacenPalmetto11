from django.urls import path
from . import views
urlpatterns = [    
    path('', views.home),
    path('getProduct/', views.getProduct),
    path('goToProduct/', views.goToProduct),
    path('createProduct/', views.createProduct),
    path('putProduct/', views.putProduct),
    path('deleteProduct/', views.deleteProduct),
]