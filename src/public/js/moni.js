$( document ).ready(function() {
    // GET REQUEST
    $("#getMeasurements").on('click', function(){
        event.preventDefault();
        ajaxGetMeasurements();
    })

    function ajaxGetMeasurements(){
      
        // PREPARE FORM DATA
        var formData = {
            selsensor : $("#sensorselect").val(),
            seltag :  $("#tagselect").val(),
            ordenarpor: $("#fechaselect").val(),
            selfecha: $("#dateselect").val()
        }

        // DO GET
        $.ajax({
            type : "GET",
            url : "/moni/filters",
            data : formData,
            dataType : 'json',
            success: function(resultado){
                let tbody = $('tbody');
                tbody.html('');
                resultado.resultado.forEach(medicion => {
                        tbody.append(`
                    <tr>
                        <td class="Sensor">${medicion.sensorid}</td>
                        <td class="Tag">${medicion.tag}</td>
                        <td class="Value">${medicion.newvalue}</td>
                        <td class="Fecha">${medicion.fecha}</td>
                        <td>
                            <button name"_id" id="${medicion._id}" style="text center; justify-content: center; cursor: pointer;" 
                            type="submit" class="nav-link"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                    `)
                });
            }
                
        });
    }
    $('table').on('click', '.nav-link', function() {
        let id = this.id;
        let row = $(this).closest('tr');
        var json = {
            "_id": id
        }
        $.ajax({
            url: '/moni/delete'+id,
            method: 'DELETE',
            data : json,
            dataType : 'json',
            success: function(response) {
                row.find('td').fadeOut(1000,function(){
                    row.remove();
                });
                
            }
        });
    });

    $("#vaciado").on('click', function(){
        var valusuarios=$("#usuarios").is(":checked");
        var valsensores=$("#sensores").is(":checked");
        var valmediciones=$("#mediciones").is(":checked");
        var jsonboleans = {
            "usuarios": valusuarios,
            "sensores": valsensores,
            "mediciones": valmediciones
        }
        if (window.confirm("Se eliminarán las colecciones seleccionadas")) {
            $.ajax({
                url: '/moni/vaciar',
                method: 'DELETE',
                data : jsonboleans,
                success: function(response) {
                    console.log(JSON.parse(JSON.stringify(response)));
                }
            });
        }
    })
})