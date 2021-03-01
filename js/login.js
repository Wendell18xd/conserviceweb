const loginform = document.getElementById("loginform");

//const registrarusuario = (correo, pass) => auth.createUserWithEmailAndPassword(correo, pass)
const iniciarsesion = (correo, pass) => auth.signInWithEmailAndPassword(correo, pass)

loginform.addEventListener("submit", async (e) => {
    e.preventDefault()

    const correo = loginform['correo'].value;
    const pass = loginform['pass'].value;

    try {
        const userCredencial = await iniciarsesion(correo, pass)
        loginform.reset();
        Swal.fire({
            title: "Exito!!",
            text: "Iniciando Sesion...",
            icon: "success"
        }).then(() => {
            window.location = "../index.html"
        })
    } catch (error) {
        toastr.error(error.message);
    }


})

/*const query = await listar();
    query.forEach(doc => {
        //console.log(doc.data())
        if (doc.data().user === loginform['usuario'].value && doc.data().pass === loginform['pass'].value) {
            Swal.fire({
                title: 'Exito!',
                text: 'Acceso Concedido!',
                icon: 'success',
                confirmButtonText: "Ok"
            }).then((result) => {
                if (result.isConfirmed) {
                    sessionStorage.setItem("id", doc.id)
                    window.location = "../index.html"
                }
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Datos erroneos'
            })
        }
    })*/
