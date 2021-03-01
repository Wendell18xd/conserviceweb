let = sesionid = "";
auth.onAuthStateChanged(user => {
    if (!user) {
        window.location = "../index.html"
    } else {
        sesionid = user.uid
        //console.log(sesionid);
    }
})

const formsesion = document.getElementById("formsesion");

const autenticador = (funcion) => auth.onAuthStateChanged(funcion)

let statusmodificar = false;
let changepassword = false;
let urlFoto = null;

formsesion.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = formsesion['user'];
    const pass = formsesion['pass'];
    const conpass = formsesion['conpass'];
    const check = formsesion['checkpass'];

    if (!statusmodificar && changepassword) {

        user.readOnly = false;
        pass.readOnly = false;
        conpass.readOnly = false;

        formsesion["modificar"].innerText = "Actualizar"
        formsesion["modificar"].className = "btn btn-warning"

        statusmodificar = true;

    } else {
        let file = ($('#my_file'))[0].files[0];

        if (file) {

            //console.log(file);

            let storageRef = storage.ref('/usuarioimagen/' + sesionid);
            let uploadtarea = storageRef.put(file);

            uploadtarea.then(function () {
                storageRef.getDownloadURL().then(async function (url) {
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', url);

                    await updateperfil(user.value, url)
                })
            });

        }
        await updateperfil(user.value)
    }

    if (pass.value != conpass.value) {
        Swal.fire({
            title: "Cuidado",
            text: "Las contraseñas ingresadas deben coincidir",
            icon: "warning"
        })
    } else {
        if (check.checked == true) {
            await updatePassword(pass.value)
        }
    }

})

let c = document.getElementById('checkpass')

function checboxpass() {
    if (c.checked == true) {
        changepassword = true
        statusmodificar = false

        pass.readOnly = false;
        conpass.readOnly = false;

        formsesion["modificar"].innerText = "Actualizar"
        formsesion["modificar"].className = "btn btn-warning"
    } else {
        changepassword = false;

        pass.readOnly = true;
        conpass.readOnly = true;

        formsesion["modificar"].innerText = "Modificar"
        formsesion["modificar"].className = "btn btn-secondary"
    }
    console.log(changepassword);

}

async function perfil() {

    user.readOnly = false;
    pass.readOnly = true;
    conpass.readOnly = true;

    formsesion["modificar"].innerText = "Modificar"
    formsesion["modificar"].className = "btn btn-secondary"

    await autenticador(user => {
        //console.log(user);
        formsesion["user"].value = user.displayName;
        formsesion['urlfoto'].src = user.photoURL

    })
    formsesion["conpass"].value = ""

    statusmodificar = false;

}

async function updateperfil(nombre, foto) {

    try {
        await autenticador(user => {
            user.updateProfile({
                displayName: nombre,
                photoURL: foto
            })
                .then(() => {
                    Swal.fire({
                        title: "Datos Actulizados",
                        text: "La contraseña o Usuario fue actulizado",
                        icon: "success"
                    })
                })
                .catch(err => {
                    console.log(err.message);
                })

        })
    } catch (error) {
        console.log(error);
    }
}

async function updatePassword(clave) {

    await autenticador(user => {

        user.updatePassword(clave)
            .then(() => {
                Swal.fire({
                    title: "Datos Actulizados",
                    text: "La contraseña o Usuario fue actulizado",
                    icon: "success"
                })
            })
            .catch(err => {
                toastr.error(err.message);
            })


    });

}



// cerrar sesion
function cerrar() {
    Swal.fire({
        title: `Estas seguro de Salir?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Sí!'
    }).then((result) => {
        if (result.isConfirmed) {

            Swal.fire({
                title: 'Cerrando Sesion...!',
                text: 'Saliendo.....',
                icon: 'success',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            }).then(() => {
                auth.signOut().then(() => {
                    window.location = "../index.html"
                })

            })


        }
    })
}


function readImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#urlfoto').attr('src', e.target.result); // Renderizamos la imagen
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$("#my_file").change(function () {
    // Código a ejecutar cuando se detecta un cambio de archivo
    readImage(this);
});