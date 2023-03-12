$(document).ready(function() {    
    const csrftoken =  window.CSRF_TOKEN;
    function validateFields (errorsReport = "", nameProduct = "", descripcionProduct = "", priceProduct = "", inventoryProduct = "") {
        $("#errorsReport").html("");
        $("#alertProduct").hide();
        if (nameProduct === undefined || nameProduct === "") {
            errorsReport += "El nombre no puede estar vacío.\n"
        }
        if (descripcionProduct === undefined || nameProduct === "") {
            errorsReport += "La descripción no puede estar vacío.\n"
        }
        if (priceProduct === undefined || priceProduct === "") {
            errorsReport += "El precio no puede estar vacío.\n"
        }
        if (inventoryProduct === undefined || inventoryProduct === "") {
            errorsReport += "El inventario no puede estar vacío.\n"
        }
        return errorsReport
    };
    $('#goToProduct').click(function() {
        $(".is_disabled_product").removeAttr("disabled");
       $.ajax({
            type: "POST",
            url: "/goToProduct/",
            data: {csrfmiddlewaretoken:csrftoken},
            async : false,
            complete: function(response) {
                $("#exampleModalCenterTitle").html("Producto");
                $("#modalBody").html(response.responseText);    
                $("#exampleModalCenter").modal('show');
                $("#createProduct").show();
                $("#saveChangesProduct").hide();
                $("#addProductCar").hide();
            },
            error: function() {
                console.error('Ha ocurrido un error');
            }
        });
    });
    $('#createProduct').click(function() {
        let errorsReport = ""
        const nameProduct = $("#nameProduct").val();
        const descripcionProduct = $("#descripcionProduct").val();
        const priceProduct = $("#priceProduct").val();
        const inventoryProduct = $("#inventoryProduct").val();
        errorsReport = validateFields(errorsReport, nameProduct, descripcionProduct, priceProduct, inventoryProduct)
        if (errorsReport.length === 0) {
            $.ajax({
                type: "POST",
                url: "/createProduct/",
                data: {csrfmiddlewaretoken:csrftoken, name_product: nameProduct, descrip_product: descripcionProduct, price_product: priceProduct, inventory_product: inventoryProduct},
                async : false,
                complete: function(response) {
                    if (response.responseJSON !== undefined && response.responseJSON['error'] && Array.isArray(response.responseJSON['error'])) {
                        if (response.responseJSON['error'] && response.responseJSON['error'].length !== 0) {
                            response.responseJSON['error'].forEach(function (text) {
                                errorsReport += text
                            })
                            $("#errorsReport").html(errorsReport);
                            $("#alertProduct").show();
                        } else {
                            window.location.reload();
                        }
                    }
                },
                error: function() {
                    console.error('Ha ocurrido un error');
                }
            });
        } else {
            $("#errorsReport").html(errorsReport);
            $("#alertProduct").show();
        }
    });
    $('.edit_product').click(function() {
        let value_id = $(this).attr("id");
       $.ajax({
            type: "POST",
            url: "/getProduct/",
            data: {csrfmiddlewaretoken:csrftoken, id:value_id},
            async : false,
            complete: function(response) {
                $("#exampleModalCenterTitle").html("Producto");
                $("#modalBody").html(response.responseText);    
                $("#exampleModalCenter").modal('show');
                $("#createProduct").hide();
                $("#addProductCar").hide();
                $("#saveChangesProduct").show();
            },
            error: function() {
                console.error('Ha ocurrido un error');
            }
        });
    });
    $('.add_product').click(function() {
        let value_id = $(this).attr("id");
       $.ajax({
            type: "POST",
            url: "/getProduct/",
            data: {csrfmiddlewaretoken:csrftoken, id:value_id},
            async : false,
            complete: function(response) {
                $("#exampleModalCenterTitle").html("Producto");
                $("#modalBody").html(response.responseText);
                $("#exampleModalCenter").modal('show');
                $("#createProduct").hide();
                $("#saveChangesProduct").hide();
                $("#addProductCar").show();
            },
            error: function() {
                console.error('Ha ocurrido un error');
            }
        });
    });
    $('.delete_car').click(function() {
        let value_id = $(this).attr("id");
        $.ajax({
             type: "POST",
             url: "/deleteCar/",
             data: {csrfmiddlewaretoken:csrftoken, id:value_id},
             async : false,
             complete: function(response) {
                window.location.reload();
             },
             error: function() {
                 console.error('Ha ocurrido un error');
             }
         });
    });
    $('#buyCar').click(function() {
        $.ajax({
             type: "POST",
             url: "/ordenes/buyCar/",
             data: {csrfmiddlewaretoken:csrftoken},
             async : false,
             complete: function(response) {
                $(".container-products").html(`<h1 class="text-success">¡Compra realizada!</h1>`);
                $("#container_btnBuy").remove();
                $("#aNumberCarrito").html("Carrito (0)")
             },
             error: function() {
                 console.error('Ha ocurrido un error');
             }
         });
    });
    $('#saveChangesProduct').click(function() {
        let errorsReport = ""
        const idProduct = $("#idProduct").val();
        const nameProduct = $("#nameProduct").val();
        const descripcionProduct = $("#descripcionProduct").val();
        const priceProduct = $("#priceProduct").val();
        const inventoryProduct = $("#inventoryProduct").val();
        if (idProduct === undefined || idProduct === "") {
            errorsReport += "El ID no esta definido, vuelve a seleccionar el producto.\n"
        }
        errorsReport = validateFields(errorsReport, nameProduct, descripcionProduct, priceProduct, inventoryProduct)
        if (errorsReport.length === 0) {
            $.ajax({
                type: "POST",
                url: "/putProduct/",
                data: {csrfmiddlewaretoken:csrftoken, id:idProduct, name_product: nameProduct, descrip_product: descripcionProduct, price_product: priceProduct, inventory_product: inventoryProduct},
                async : false,
                complete: function(response) {
                    if (response.responseJSON !== undefined && response.responseJSON['error'] && Array.isArray(response.responseJSON['error'])) {
                        if (response.responseJSON['error'] && response.responseJSON['error'].length !== 0) {
                            response.responseJSON['error'].forEach(function (text) {
                                errorsReport += text
                            })
                            $("#errorsReport").html(errorsReport);
                            $("#alertProduct").show();
                        } else {
                            window.location.reload();
                        }
                    }
                },
                error: function() {
                    console.error('Ha ocurrido un error');
                }
            });
        } else {
            $("#errorsReport").html(errorsReport);
            $("#alertProduct").show();
        }
    });
    $('#addProductCar').click(function() {
        let errorsReport = ""
        const idProduct = $("#idProduct").val();
        const nameProduct = $("#nameProduct").val();
        const quantityProduct = $("#quantityProduct").val();
        const inventoryProduct = $("#inventoryProduct").val();
        if (idProduct === undefined || idProduct === "") {
            errorsReport += "El ID no esta definido, vuelve a seleccionar el producto.\n"
        }
        if (quantityProduct === undefined || quantityProduct === "") {
            errorsReport += "El cantidad es vacía.\n"
        }
        if (parseFloat(quantityProduct) <= 0 || parseFloat(quantityProduct) > parseFloat(inventoryProduct)) {
            errorsReport += "Debe especificar una cantidad válida.\n"
        }
        if (errorsReport.length === 0) {
            $.ajax({
                type: "POST",
                url: "/addProductCar/",
                data: {csrfmiddlewaretoken:csrftoken, id:idProduct, name_product: nameProduct, quantity_product: quantityProduct},
                async : false,
                complete: function(response) {
                    console.log('ENviad')
                    if (response.responseJSON !== undefined && response.responseJSON['error'] && Array.isArray(response.responseJSON['error'])) {
                        if (response.responseJSON['error'] && response.responseJSON['error'].length !== 0) {
                            response.responseJSON['error'].forEach(function (text) {
                                errorsReport += text
                            })
                            $("#errorsReport").html(errorsReport);
                            $("#alertProduct").show();
                        } else {
                            window.location.reload();
                        }
                    }
                },
                error: function() {
                    console.error('Ha ocurrido un error');
                }
            });
        } else {
            $("#errorsReport").html(errorsReport);
            $("#alertProduct").show();
        }
    });
});