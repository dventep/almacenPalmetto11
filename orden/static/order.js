$(document).ready(function() {    
    const csrftoken =  window.CSRF_TOKEN;
    function validateFields (errorsReport = "", nameOrder = "", emailOrder = "", totalOrder = "", fechaOrder = "") {
        $("#errorsReport").html("");
        $("#alertOrder").hide();
        if (nameOrder === undefined || nameOrder === "") {
            errorsReport += "El nombre del cliente no puede estar vacío.\n"
        }
        if (emailOrder === undefined || emailOrder === "") {
            errorsReport += "El email del cliente no puede estar vacío.\n"
        }
        if (totalOrder === undefined || totalOrder === "") {
            errorsReport += "El total de cuenta no puede estar vacío.\n"
        }
        if (fechaOrder === undefined || nameOrder === "") {
            errorsReport += "La fecha no puede estar vacía.\n"
        }
        return errorsReport
    };
    $('#goToOrder').click(function() {
       $.ajax({
            type: "POST",
            url: "/ordenes/goToOrder/",
            data: {csrfmiddlewaretoken:csrftoken},
            async : false,
            complete: function(response) {
                $("#exampleModalCenterTitle").html("Orden");
                $("#modalBody").html(response.responseText);    
                $("#exampleModalCenter").modal('show');
                $("#createOrder").show();
                $("#saveChangesOrder").hide();
            },
            error: function() {
                console.error('Ha ocurrido un error');
            }
        });
    });
    $('#createOrder').click(function() {
        let errorsReport = ""
        const nameOrder = $("#nameOrder").val();
        const emailOrder = $("#emailOrder").val();
        const totalOrder = $("#totalOrder").val();
        const fechaOrder = $("#fechaOrder").val();
        errorsReport = validateFields(errorsReport, nameOrder, emailOrder, totalOrder, fechaOrder)
        if (errorsReport.length === 0) {
            $.ajax({
                type: "POST",
                url: "/ordenes/createOrder/",
                data: {csrfmiddlewaretoken:csrftoken, name_order: nameOrder, fecha_order: fechaOrder, total_order: totalOrder, email_order: emailOrder},
                async : false,
                complete: function(response) {
                    if (response.responseJSON !== undefined && response.responseJSON['error'] && Array.isArray(response.responseJSON['error'])) {
                        if (response.responseJSON['error'] && response.responseJSON['error'].length !== 0) {
                            response.responseJSON['error'].forEach(function (text) {
                                errorsReport += text
                            })
                            $("#errorsReport").html(errorsReport);
                            $("#alertOrder").show();
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
            $("#alertOrder").show();
        }
    });
    $('.edit_order').click(function() {
        let value_id = $(this).attr("id");
       $.ajax({
            type: "POST",
            url: "/ordenes/getOrder/",
            data: {csrfmiddlewaretoken:csrftoken, id:value_id},
            async : false,
            complete: function(response) {
                $("#exampleModalCenterTitle").html("Orden");
                $("#modalBody").html(response.responseText);    
                $("#exampleModalCenter").modal('show');
                $("#createOrder").hide();
                $("#saveChangesOrder").show();
            },
            error: function() {
                console.error('Ha ocurrido un error');
            }
        });
    });
    $('#saveChangesOrder').click(function() {
        let errorsReport = ""
        const idOrder = $("#idOrder").val();
        const nameOrder = $("#nameOrder").val();
        const emailOrder = $("#emailOrder").val();
        const totalOrder = $("#totalOrder").val();
        const fechaOrder = $("#fechaOrder").val();
        if (idOrder === undefined || idOrder === "") {
            errorsReport += "El ID no esta definido, vuelve a seleccionar el ordero.\n"
        }
        errorsReport = validateFields(errorsReport, nameOrder, emailOrder, totalOrder, fechaOrder)
        if (errorsReport.length === 0) {
            $.ajax({
                type: "POST",
                url: "/ordenes/putOrder/",
                data: {csrfmiddlewaretoken:csrftoken, id:idOrder, name_order: nameOrder, fecha_order: fechaOrder, total_order: totalOrder, email_order: emailOrder},
                async : false,
                complete: function(response) {
                    if (response.responseJSON !== undefined && response.responseJSON['error'] && Array.isArray(response.responseJSON['error'])) {
                        if (response.responseJSON['error'] && response.responseJSON['error'].length !== 0) {
                            response.responseJSON['error'].forEach(function (text) {
                                errorsReport += text
                            })
                            $("#errorsReport").html(errorsReport);
                            $("#alertOrder").show();
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
            $("#alertOrder").show();
        }
    });
});