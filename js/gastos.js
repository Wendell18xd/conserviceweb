auth.onAuthStateChanged(user =>{
    if(!user){
        window.location = "../index.html"
    }
})

function fechaactual() {
    let date = new Date();

    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    if (month < 10) {
        return `${day}-0${month}-${year}`
    } else {
        return `${day}-${month}-${year}`
    }
}

//console.log(fechaactual())

const formgasto = document.getElementById("formgasto");

const listar = () => db.collection("gastos").get();
const listarP = () => db.collection("servicios").get();
const onListar = (callback) => db.collection("gastos").orderBy("fecha", "asc").onSnapshot(callback);
const registrar = (datos) => db.collection("gastos").doc().set(datos);
const obtener = (id) => db.collection("gastos").doc(id).get();
const update = (id, update) => db.collection("gastos").doc(id).update(update);
const deletegasto = id => db.collection("gastos").doc(id).delete();


let proformacorrecta = false;
let statuseditar = false;
let idedit = "";


$(document).ready(async function () {

    $(".encabesado").load("./encabezado.html");
    document.getElementById("listatabla").innerHTML='<h3><i class="fas fa-spinner fa-spin"></i> Cargando......</h3>'
    gastodia()

    await onListar((query) => {
        reg = [];
        query.forEach(doc => {
            //console.log(doc.data());

            reg.push({
                fecha: doc.data().fecha,
                proforma: doc.data().proforma,
                detalle: doc.data().detalle,
                importe: "S/. " + doc.data().importe,
                boton: `<button id="btn-editar" class="btn btn-warning btn-sm " data-bs-toggle="modal" data-bs-target="#registrar" onclick="editar('${doc.id}')"><i class="far fa-edit"></i></button>
                <button id="btn-eliminar" class="btn btn-danger btn-sm btn-delete" onclick="eliminar('${doc.id}')"><i class="fas fa-trash-alt"></i></button>`
            })

            //console.log(reg);

        })
        
        Tabla(reg);
        document.getElementById("listatabla").innerHTML=''
    })

});

function Tabla(reg) {

    $('#listagastos').DataTable({
        data: reg,

        columnDefs: [{
                "searchable": false,
                "targets": 2
            },
            {
                "searchable": false,
                "targets": 3
            },
        ],

        columns: [{
                data: 'fecha'
            },
            {
                data: 'proforma'
            },
            {
                data: 'detalle'
            },
            {
                data: 'importe'
            },
            {
                data: 'boton'
            }
        ],
        destroy: true,
        responsive: "true",
        dom:'Bfrtilp',
        buttons: [
            {
                extend: 'excelHtml5',
                text: '<i class="fas fa-file-excel"></i>',
                titleAttr: 'Exportar a Excel',
                className: 'btn btn-success'
            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fas fa-file-pdf"></i>',
                titleAttr: 'Exportar a PDF',
                className: 'btn btn-danger'
            },
            {
                extend: 'print',
                text: '<i class="fas fa-print"></i>',
                titleAttr: 'Imprimir',
                className: 'btn btn-info'
            }
        ]

    });

}

const fecha = formgasto['fecha'].value = fechaactual();

formgasto.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const proforma = formgasto['proforma'];
    const importe = formgasto['importe'];
    const detalle = formgasto['detalle'];

    if (proformacorrecta) {

        if (!statuseditar) {
            //registrando
            await registrar({
                fecha: fecha,
                proforma: proforma.value,
                importe: importe.value,
                detalle: detalle.value
            })
            Swal.fire({
                title: "Exito!!",
                text: "Registrado correctamente",
                icon: "success"
            }).then(() => {
                limpiar();
                gastodia();
            })
        } else {
            //actulizando
            await update(idedit, {
                proforma: proforma.value,
                importe: importe.value,
                detalle: detalle.value
            }).then(() => {
                gastodia();
            })
            Swal.fire({
                title: "Exito!!",
                text: "Actulizado correctamente",
                icon: "success"
            })
        }

    } else {
        Swal.fire({
            title: "Cuidado!!",
            text: "La proforma Indicada No existe",
            icon: "warning"
        }).then(() => {
            formgasto['proforma'].focus();
        })
    }

})

async function editar(id) {

    statuseditar = true;
    proformacorrecta = true;

    $("#btn-registrar").addClass("btn-warning");
    $("#btn-registrar").removeClass("btn-success");
    $("#btn-registrar").html("Actulizar");

    const doc = await obtener(id);

    formgasto['fecha'].value = doc.data().fecha;
    formgasto['proforma'].value = doc.data().proforma;
    formgasto['detalle'].value = doc.data().detalle;
    formgasto['importe'].value = doc.data().importe;
    idedit = id;

}

// Eliminar
async function eliminar(id) {
    const doc = await obtener(id)
    Swal.fire({
        title: `Estas seguro de eliminar a ${doc.data().proforma}?`,
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Sí, bórralo!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await deletegasto(id)
            Swal.fire(
                'Eliminado!',
                'Eliminado Correctamente',
                'success'
            )
            gastodia()
        }
    })

}

async function validar() {

    formgasto['proforma'].value = formgasto['proforma'].value.toUpperCase();

    const query = await listarP();

    $("#existe").html("Profoma no existente");
    $("#existe").css("color", "red");
    $("#existe").css("display", "block");
    proformacorrecta = false;
    query.forEach(doc => {

        if (doc.data().numproforma === formgasto['proforma'].value) {
            $("#existe").html("Profoma existente");
            $("#existe").css("color", "blue");
            proformacorrecta = true;
        }

        if (formgasto['proforma'].value == "") {
            $("#existe").css("display", "none");
        }
    })

}

function limpiar() {

    formgasto.reset()
    formgasto['fecha'].value = fechaactual();
    formgasto['proforma'].focus();
    $("#existe").css("display", "none");

    $("#btn-registrar").removeClass("btn-warning");
    $("#btn-registrar").addClass("btn-success");
    $("#btn-registrar").html("Guardar");

    statuseditar = false;

}

async function gastodia() {

    let gastos = [];
    let gastototal = 0;
    const query = await listar();

    query.forEach(doc => {

        if (doc.data().fecha === fechaactual()) {

            gastos.push(parseFloat(doc.data().importe));
            gastototal = gastos.reduce((a, b) => a + b, 0)
        }

    })

    document.getElementById("mostrargasto").innerHTML = `<strong>Gasto Total del dia: </strong>S/. <span style="background-color: yellow;">${gastototal}</span>`

    console.log(gastototal);
}