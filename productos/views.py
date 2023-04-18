from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.http import HttpResponse, JsonResponse
import requests

SERVER_IP = "storage_products_micro"
#SERVER_IP = "192.168.100.2"

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

def home(request):
    """
        ----------
        Description
            Esta función trae todos los productos.
    """
    
    if 'login' in request.session:
        request_to_api = make_request_get(f"http://{SERVER_IP}:3002/productos")
        productos_list = []
        if request_to_api:
            productos_list = request_to_api
        return render(request, 'productos.html', {"products":productos_list})
    else:
        return redirect('/usuarios/')
    
def getProduct(request):
    """
        ----------
        Description
            Esta función trae todos los productos.
    """
    product_info = {}
    content_return = {'product':product_info, 'disabled':'disabled'}
    if 'login' in request.session:
        if 'edit_product_' in request.POST['id'] and len(request.POST['id'].split('edit_product_')) > 0:
            id_to_send = (request.POST['id'].split('edit_product_'))[1]
            request_to_api = make_request_get(f"http://{SERVER_IP}:3002/productos/{id_to_send}")
            if request_to_api:
                product_info = request_to_api
        elif 'add_product_' in request.POST['id'] and len(request.POST['id'].split('add_product_')) > 0:
            id_to_send = (request.POST['id'].split('add_product_'))[1]
            request_to_api = make_request_get(f"http://{SERVER_IP}:3002/productos/{id_to_send}")
            if request_to_api:
                product_info = request_to_api
                content_return['addproduct'] = {'quantity':0}
    content_return['product'] = product_info
        # if request_to_api:
        #     product_info = request_to_api
    html = render_to_string("base/formProduct.html", content_return)
    return HttpResponse(html)
    
def goToProduct(request):
    """
        ----------
        Description
            Esta función trae los campos para llenar y crear el registro.
    """
    content_return = {}
    html = render_to_string("base/formProduct.html", content_return)
    return HttpResponse(html)

def createProduct(request):
    """
        ----------
        Description
            Esta función actualiza un producto determinado.
    """
    content_return = {'error':[]}
    if 'login' in request.session:
        if request.POST.get('name_product', False) and request.POST.get('descrip_product', False) and request.POST.get('price_product', False) and request.POST.get('inventory_product', False):
            json_to_send = {
                'nombre': request.POST.get('name_product'),
                'descripcion': request.POST.get('descrip_product'),
                'precio': request.POST.get('price_product'),
                'inventario': request.POST.get('inventory_product')
            }
            request_to_api = make_request_post(f"http://{SERVER_IP}:3002/productos", json_to_send)
            if not request_to_api:
                content_return['error'].append('Durante el proceso surgió un error.')
        else:
            content_return['error'].append('No se recibió el ID adecuado.')
    return JsonResponse(content_return, safe=False)
    
def putProduct(request):
    """
        ----------
        Description
            Esta función actualiza un producto determinado.
    """
    content_return = {'error':[]}
    if 'login' in request.session:
        if request.POST.get('id', False):
            json_to_send = {
                'id': request.POST.get('id'),
                'nombre': request.POST.get('name_product'),
                'descripcion': request.POST.get('descrip_product'),
                'precio': request.POST.get('price_product'),
                'inventario': request.POST.get('inventory_product')
            }
            request_to_api = make_request_put("http://{}:3002/productos/{}" .format(SERVER_IP, request.POST.get('id')), json_to_send)
            if not request_to_api:
                content_return['error'].append('Durante el proceso surgió un error.')
        else:
            content_return['error'].append('No se recibió el ID adecuado.')
    return JsonResponse(content_return, safe=False)

def addProductCar(request):
    """
        ----------
        Description
            Esta función añade productos al carro.
    """
    content_return = {'error':[]}
    if 'login' in request.session:
        if request.POST.get('id', False):
            request.session['carrito'] = request.session['carrito'] + 1
            request.session['lista_carrito'].append(
                {
                    'id': request.POST.get('id'),
                    'nombre': request.POST.get('name_product'),
                    'cantidad': request.POST.get('quantity_product')
                }
            )
        else:
            content_return['error'].append('No se recibió el ID adecuado.')
    return JsonResponse(content_return, safe=False)

def deleteProductCar (request):
    """
        ----------
        Description
            Esta función elimina el producto del carrito.
    """
    content_return = {'error':[]}
    if 'login' in request.session:
        if request.POST.get('id', False):
            value_id = int(request.POST['id'].split("delete_car_")[1])
            request.session['carrito'] = request.session['carrito'] - 1
            if len(request.session['lista_carrito']) >= value_id:
                del request.session['lista_carrito'][value_id]
            else:
                print('Carro no eliminado')
    return JsonResponse(content_return, safe=False)
