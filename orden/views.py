from django.shortcuts import render, redirect
from django.template.loader import render_to_string
from django.http import HttpResponse, JsonResponse
import traceback
import requests

#SERVER_IP = "storage_orders_micro"
SERVER_IP = "192.168.100.2"

def make_request_get(url, params={}):
    if params:
        response = requests.get("{}/{}" .format(url, "/".join(params)))
    else:
        response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return False
    
def make_request_post(url, params={}):
    if params:
        response = requests.post(url, json=params, headers = {'Content-Type': "application/json", 'Accept': "application/json"})
    else:
        return False
    if response.status_code == 200:
        # return response.json()
        return True
    else:
        return False
    
def make_request_delete(url):
    response = requests.delete(url)
    if response.status_code == 200:
        return True
    else:
        return False
    
def make_request_put(url, params={}):
    if params:
        response = requests.put(url, json=params, headers = {'Content-Type': "application/json", 'Accept': "application/json"})
    else:
        return False
    if response.status_code == 200:
        return True
    else:
        return False

def listOrden(request):
    """
        ----------
        Description
            Esta función nos trae la lista de ordeness.
    """
    if 'login' in request.session:
        request_to_api = make_request_get(f"http://{SERVER_IP}:3003/ordenes")
        orders_list = []
        if request_to_api:
            orders_list = request_to_api
        return render(request, 'list_orders.html', {"orders":orders_list})
    else:
        return redirect('/usuarios/')
    
def listCarrito(request):
    """
        ----------
        Description
            Esta función muestra el carrito.
    """
    # content_return = {'error':[]}
    return render(request, 'carrito.html', {})

def buyCar (request):
    """
        ----------
        Description
            Esta función realiza la compra de los productos del carrito.
    """
    list_to_send = []
    for product in request.session['lista_carrito']:
        list_to_send.append(
            { 'id': product['id'], 'cantidad':product['cantidad']}
        )
    content_to_send = {
        "usuario": request.session['login']['id'],
        "items": list_to_send
    }
    requesto_to_api = make_request_post(f"http://{SERVER_IP}:3003/ordenes", content_to_send)
    if requesto_to_api:
        request.session['lista_carrito'] = []
        request.session['carrito'] = 0
    return JsonResponse({}, safe=False)
