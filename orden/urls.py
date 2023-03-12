from django.urls import path
from . import views
urlpatterns = [    
    path('', views.listOrden),
    path('carrito/', views.listCarrito),
    path('buyCar/', views.buyCar),
]