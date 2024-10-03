


$("#add_user").submit(function(event){
    alert("Data Inserted Successfully!");
})

$("#update_user").submit(function(event){
    event.preventDefault();

    var unindexed_array = $(this).serializeArray();
    var data = {}

    $.map(unindexed_array, function(n, i){
        data[n['name']] = n['value']
    })


    var request = {
        "url" : `http://localhost:3000/api/users/${data.id}`,
        "method" : "PUT",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!");
    })

})

if(window.location.pathname == "/"){
    $ondelete = $(".table tbody td a.delete");
    $ondelete.click(function(){
        var id = $(this).attr("data-id")

        var request = {
            "url" : `http://localhost:3000/api/users/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this record?")){
            $.ajax(request).done(function(response){
                alert("Data Deleted Successfully!");
                location.reload();
            })
        }

    })
}

$("#register_user").submit(function(event) {
    event.preventDefault();

    var name = $("input[name='name']").val();
    var email = $("input[name='email']").val();
    var password = $("input[name='password']").val();

    $.ajax({
        url: '/register',
        method: 'POST',
        data: {
            name: name,
            email: email,
            password: password
        },
        success: function(response) {
            alert("Registro exitoso. Redirigiendo a la página de login.");
            window.location.href = "/login";
        },
        error: function(err) {
            alert("Error al intentar registrarse. Inténtelo nuevamente.");
        }
    });
});

$("#login_user").submit(function(event) {
    event.preventDefault();

    var email = $("input[name='email']").val();
    var password = $("input[name='password']").val();

    $.ajax({
        url: '/login',
        method: 'POST',
        data: {
            email: email,
            password: password
        },
        success: function(response) {
            if (response.success) {
                alert("Login exitoso. Redirigiendo al dashboard.");
                window.location.href = "/dashboard";  // Adjust this according to your project structure
            } else {
                alert(response.message); // Show any error message from the server
            }
        },
        error: function(err) {
            alert("Error al intentar iniciar sesión. Verifique sus credenciales.");
        }
    });
});