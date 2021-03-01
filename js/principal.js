auth.onAuthStateChanged(user =>{
    if(!user){
        window.location = "../index.html"
    }
})

// datatable
function Tabla(data) {

    $('#listadeservicios').DataTable({
        data: data,

        columns: [
            { data: 'fechaactual' },
            { data: 'nombre' },
            { data: 'tiposervicio' },
            { data: 'cantidad' },
            { data: 'numproforma' },
            { data: 'tratoinicial' },
            { data: 'acuenta' },
            { data: 'debiendo' },
            { data: 'total' },
            { data: 'estado' },
            { data: "boton" }
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



// obtener fecha actual
let date = new Date();

let day = date.getDate()
let month = date.getMonth() + 1
let year = date.getFullYear()

let fechaactualglobal = ""

if (month < 10) {
    fechaactualglobal = `${day}-0${month}-${year}`
} else {
    fechaactualglobal = `${day}-${month}-${year}`
}

$(document).ready(function () {
    document.getElementById("fechaactual").value = fechaactualglobal
    $(".encabesado").load("./encabezado.html");
})

//validacion numero de telefono
var input = document.getElementById('telefono');
input.addEventListener('input', function () {
    if (this.value.length > 9)
        this.value = this.value.slice(0, 9);
})


//almecenar variables
const formulario = document.getElementById("datoscliente");
const formularioeditar = document.getElementById("datosclienteeditar");
const tablaservicios = document.getElementById("listadeservicios");
const card1 = document.getElementById("1");
const card2 = document.getElementById("2");
const card3 = document.getElementById("3");
const card4 = document.getElementById("4");


let editstatus = false;
let deudastatus = false;
let idg = "";

// funciones
const registrar = (fechaactual, nombre, direccion, telefono, tiposervicio, cantidad, detalle, numproforma, tratoinicial, acuenta, deposito, igv, estado, debiendo, total, fechaentrega, hora, seruv, cantidadservicio, igvsumado) =>

    db.collection("servicios").doc().set({
        fechaactual,
        nombre,
        direccion,
        telefono,
        tiposervicio,
        cantidad,
        detalle,
        numproforma,
        tratoinicial,
        acuenta,
        deposito,
        igv,
        estado,
        debiendo,
        total,
        fechaentrega,
        hora,
        seruv,
        cantidadservicio,
        igvsumado
    })

const registrarfecha = (fecha) =>
    db.collection("fecha").doc(fechaactualglobal).set({
        fecha
    })

const listar = () => db.collection("servicios").get();
const listarg = () => db.collection("gastos").get();
const listarfecha = () => db.collection("fecha").get();
const onListar = (callback) => db.collection("servicios").orderBy("nombre", "asc").onSnapshot(callback);
const deleteservicio = id => db.collection("servicios").doc(id).delete();
const obtenerservicio = (id) => db.collection("servicios").doc(id).get();
const updateservicio = (id, updateservicio) => db.collection("servicios").doc(id).update(updateservicio);
const registrarcaja = (id, datos) => db.collection("caja").doc(id).set(datos);
const registrarMontoDeposito = (id, datos) => db.collection("Montodeposito").doc(id).set(datos);
//dinamico
const listarDinamic = (tabla) => db.collection(tabla).get();
const obtenerDinamic = (id, tabla) => db.collection(tabla).doc(id).get();
const updateDinamic = (id, tabla, updateservicio) => db.collection(tabla).doc(id).update(updateservicio);
const registroDinamic = (tabla, datos) => db.collection(tabla).doc().set(datos);
const registroDinamicId = (id, tabla, datos) => db.collection(tabla).doc(id).set(datos);




//listar cuando carga la pagina
window.addEventListener("DOMContentLoaded", async (e) => {
    document.getElementById("listatabla").innerHTML = '<h3><i class="fas fa-spinner fa-spin"></i> Cargando......</h3>'
    await onListar((query) => {
        data = [];
        query.forEach(doc => {
            //console.log(doc.data())
            if (doc.data().estado === "Debiendo") {
                var color = "white";
                var fondo2 = "yellow";
                var fondo = "red";
                var accion = `onclick="pagardeuda('${doc.id}')" data-bs-toggle="modal" data-bs-target="#registrar"`
                var cursor = `cursor:pointer;`;
            } else {
                var color = "white";
                var fondo = "green";
            }

            if (doc.data().estado === " " || doc.data().estado === "Cancelado") {
                var disa = "disabled";
            } else {
                var modal = `data-bs-toggle="modal" data-bs-target="#registrar"`;
            }

            data.push({
                fechaactual: doc.data().fechaactual,
                nombre: `<span style="cursor:pointer" onclick="mostrardatos('${doc.id}')">${doc.data().nombre}</span>`,
                tiposervicio: doc.data().tiposervicio,
                cantidad: doc.data().cantidad,
                numproforma: doc.data().numproforma,
                tratoinicial: "S/. " + doc.data().tratoinicial,
                acuenta: `<span title="Deposito: ${doc.data().deposito}">S/. ${doc.data().acuenta}</span>`,
                debiendo: `<span style="background-color:${fondo2}" >S/. ${doc.data().debiendo}</span>`,
                total: "S/. " + doc.data().total,
                estado: `<span id="saldo" ${accion} style="background-color:${fondo};color:${color}; ${cursor}">${doc.data().estado}</span>`,
                boton: ` <button ${disa} id="btn-editar" class="btn btn-warning btn-sm "  ${modal} onclick="editar('${doc.id}')"><i class="far fa-edit"></i></button>
                    <button ${disa} id="btn-eliminar" class="btn btn-danger btn-sm btn-delete" onclick="eliminar('${doc.id}')"><i class="fas fa-trash-alt"></i></button>`
            })

        })

        //console.log(data)
        document.getElementById("listatabla").innerHTML = ""
        Tabla(data)
    })

})


// Eliminar
async function eliminar(id) {
    const doc = await obtenerservicio(id)
    Swal.fire({
        title: `Estas seguro de eliminar a ${doc.data().nombre}?`,
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Sí, bórralo!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await deleteservicio(id)
            Swal.fire(
                'Eliminado!',
                'El servicio fue eliminado',
                'success'
            )
        }
    })

}
// registrar
formulario.addEventListener("submit", async (e) => {
    document.getElementById("guardar").disabled = true;
    e.preventDefault()

    var igv = 0;
    var estado = "";
    var debiendo = 0;
    var total = 0;
    var deposito = ""
    const fechaactual = formulario['fechaactual'];
    const nombre = formulario['nombre'];
    const direccion = formulario['direccion'];
    const telefono = formulario['telefono'];
    const tiposervicio = formulario['tiposervicio'];
    const cantidad = formulario['cantidad'];
    const detalle = formulario['detalle'];
    const numproforma = formulario['numproforma'];
    const tratoinicial = formulario['tratoinicial'];
    const acuenta = formulario['acuenta'];
    const checkdeposito = formulario['deposito'];
    const estadof = formulario['estado'];

    const igvsumado = formulario['igvsumado'];
    const checkbox = formulario['igv'];


    if (checkbox.checked == true) {
        igv = 0.18;
        total = parseFloat(tratoinicial.value)
    } else {
        igv = 0;
        igvsumado.value = 0;
        total = parseFloat(tratoinicial.value)
    }

    if (checkdeposito.checked == true) {
        deposito = "si";
    } else {
        deposito = "no";
    }

    if (total == parseFloat(acuenta.value)) {
        estado = "Pago Completo"
        debiendo = 0
    } else {
        estado = "Debiendo"
        debiendo = (total - (parseFloat(acuenta.value))).toFixed(2)
    }



    const fechaentrega = formulario['fecha-entrega'];

    let fechaentre = moment(fechaentrega.value);
    let fechafort = fechaentre.format("YYYY-MM-DD");

    //console.log(fechaentre,fechafort)

    const hora = formulario['hora'];
    const seruv = formulario['ser-uv'];
    const cantidadservicio = formulario['cantidadservicio'];


    if (tiposervicio.value == "nada") {
        document.getElementById("guardar").disabled = false;
        Swal.fire({
            icon: 'error',
            title: 'Seleccione un servicio primero'
        })
        tiposervicio.focus();

    } else {

        if (!editstatus && !deudastatus) {

            await registrar(fechaactual.value, nombre.value, direccion.value, telefono.value, tiposervicio.value, cantidad.value, detalle.value, numproforma.value, tratoinicial.value, acuenta.value, deposito, igv, estado, debiendo, total, fechafort, hora.value, seruv.value, cantidadservicio.value, igvsumado.value);

            deudastatus = false;

            Swal.fire(
                'Exito!',
                'Registro guardado correctamente!',
                'success'
            )

            formulario.reset();
        } else if (editstatus && !deudastatus) {

            if (estadof.value == "Pago Completo" || estadof.value == "Debiendo") {

                await updateservicio(idg, {
                    fechaactual: fechaactual.value,
                    nombre: nombre.value,
                    direccion: direccion.value,
                    telefono: telefono.value,
                    tiposervicio: tiposervicio.value,
                    cantidad: cantidad.value,
                    detalle: detalle.value,
                    numproforma: numproforma.value,
                    tratoinicial: tratoinicial.value,
                    acuenta: acuenta.value,
                    deposito: deposito,
                    igv: igv,
                    estado: estado,
                    debiendo: debiendo,
                    total: total,
                    fechaentrega: fechafort,
                    hora: hora.value,
                    seruv: seruv.value,
                    cantidadservicio: cantidadservicio.value,
                    igvsumado: igvsumado.value
                })

            } else {
                await updateservicio(idg, {
                    fechaactual: fechaactual.value,
                    nombre: nombre.value,
                    direccion: direccion.value,
                    telefono: telefono.value,
                    tiposervicio: tiposervicio.value,
                    cantidad: cantidad.value,
                    detalle: detalle.value,
                    numproforma: numproforma.value,
                    tratoinicial: tratoinicial.value,
                    acuenta: acuenta.value,
                    deposito: deposito,
                    igv: igv,
                    debiendo: debiendo,
                    total: total,
                    fechaentrega: fechafort,
                    hora: hora.value,
                    seruv: seruv.value,
                    cantidadservicio: cantidadservicio.value,
                    igvsumado: igvsumado.value
                })
            }


            deudastatus = false;

            Swal.fire(
                'Exito!',
                'Registro actulizado correctamente!',
                'success'
            )

        } else {
            await updateservicio(idg, {
                estado: "Cancelado",
            })

            //alert("editando")
            estado = " ";
            debiendo = 0;
            igv = 0;



            await registrar(fechaactual.value, nombre.value, direccion.value, telefono.value, tiposervicio.value, cantidad.value, detalle.value, numproforma.value, tratoinicial.value, acuenta.value, deposito, igv, estado, debiendo, total, fechafort, hora.value, seruv.value, cantidadservicio.value, igvsumado.value);

            Swal.fire(
                'Exito!',
                'Deuda actulizada!',
                'success'
            )

            deudastatus = false;
            editstatus = false;
        }





        var f = new Date();
        fechaactual.value = f.getDate() + "-" + (f.getMonth() + 1) + "-" + f.getFullYear();

        nombre.focus();
        document.getElementById("guardar").disabled = false;
    }

    //console.log(debiendo,estado,igv, fechaactual, nombre, direccion, telefono, tiposervicio, cantidad, detalle, numproforma, tratoinicial, acuenta, deposito, fechaentrega, hora, seruv, cantidadservicio)

})

// pagar deuda
async function pagardeuda(id) {
    console.log(id)

    card1.style.display = "none";
    card2.style.display = "none";
    card4.style.display = "none";
    card3.className = "col-12 col-md-12"

    document.getElementById("tratoinicial").readOnly = true;
    document.getElementById("acuenta").readOnly = true;
    document.getElementById("divigv").style.display = "none";

    const doc = await obtenerservicio(id)

    deudastatus = true;
    editstatus = false;
    idg = id;

    formulario["guardar"].value = "Pagar Deuda"
    formulario["guardar"].className = "btn btn-primary"

    const servicio = doc.data();

    formulario['fechaactual'].value = fechaactualglobal;
    formulario['nombre'].value = servicio.nombre;
    formulario['direccion'].value = " ";
    formulario['telefono'].value = "0";
    formulario['tiposervicio'].value = " ";
    formulario['cantidad'].value = "0";
    formulario['detalle'].value = " ";
    formulario['numproforma'].value = servicio.numproforma;
    formulario['tratoinicial'].value = servicio.tratoinicial;
    formulario['acuenta'].value = servicio.debiendo;
    formulario['deposito'].value = servicio.deposito;
    formulario['igv'].value = servicio.igv;
    formulario['fecha-entrega'].value = " ";
    formulario['hora'].value = " ";
    formulario['ser-uv'].value = " ";
    formulario['cantidadservicio'].value = "0";
    formulario['estado'].value = servicio.estado;
    formulario['igvsumado'].value = 0

    if (formulario['igv'].value == 0.18) {
        formulario['igv'].checked = true;
    } else {
        formulario['igv'].checked = false;
    }

    if (formulario['deposito'].value == "si") {
        formulario['deposito'].checked = true;
    } else {
        formulario['deposito'].checked = false;
    }


}

//editar
async function editar(id) {

    card1.style.display = "block";
    card2.style.display = "block";
    card4.style.display = "block";
    card3.className = "col-12 col-md-6"

    document.getElementById("tratoinicial").readOnly = false;
    document.getElementById("acuenta").readOnly = false;
    document.getElementById("divigv").style.display = "block";


    const doc = await obtenerservicio(id)

    if (doc.data().estado == "Cancelado" || doc.data().estado == " ") {
        document.getElementById("tratoinicial").readOnly = true;
        document.getElementById("acuenta").readOnly = true;
    }

    editstatus = true;
    deudastatus = false;
    idg = id;

    formulario["guardar"].value = "Actualizar"
    formulario["guardar"].className = "btn btn-warning"

    const servicio = doc.data();

    formulario['fechaactual'].value = servicio.fechaactual;
    formulario['nombre'].value = servicio.nombre;
    formulario['direccion'].value = servicio.direccion;
    formulario['telefono'].value = servicio.telefono;
    formulario['tiposervicio'].value = servicio.tiposervicio;
    formulario['cantidad'].value = servicio.cantidad;
    formulario['detalle'].value = servicio.detalle;
    formulario['numproforma'].value = servicio.numproforma;
    formulario['tratoinicial'].value = servicio.tratoinicial;
    formulario['acuenta'].value = servicio.acuenta;
    formulario['deposito'].value = servicio.deposito;
    formulario['igv'].value = servicio.igv;
    formulario['fecha-entrega'].value = servicio.fechaentrega;
    formulario['hora'].value = servicio.hora;
    formulario['ser-uv'].value = servicio.seruv;
    formulario['cantidadservicio'].value = servicio.cantidadservicio;
    formulario['estado'].value = servicio.estado;
    formulario['igvsumado'].value = servicio.igvsumado;

    if (formulario['igv'].value == 0.18) {
        formulario['igv'].checked = true;
    } else {
        formulario['igv'].checked = false;
    }

    if (formulario['deposito'].value == "si") {
        formulario['deposito'].checked = true;
    } else {
        formulario['deposito'].checked = false;
    }

}

function limpiar() {
    card1.style.display = "block";
    card2.style.display = "block";
    card4.style.display = "block";
    card3.className = "col-12 col-md-6"

    document.getElementById("tratoinicial").readOnly = false;
    document.getElementById("acuenta").readOnly = false;
    document.getElementById("divigv").style.display = "block";

    formulario.reset();
    formulario['fechaactual'].value = fechaactualglobal;
    formulario['nombre'].focus();
    editstatus = false;
    formulario["guardar"].value = "Guardar"
    formulario["guardar"].className = "btn btn-success"
}

function limpcaja() {

    const datoscaja = document.getElementById("datoscaja");
    const fechacaja = document.getElementById("fechacaja");
    datoscaja.innerHTML = "Escoga una fecha";
    fechacaja.value = " ";
    $("#alertacaja").html("");

}

async function caja(e) {

    $("#alertacaja").html("");

    const datoscaja = document.getElementById("datoscaja");

    let fecha = moment(e.value);
    let fechafort = fecha.format("DD-MM-YYYY");


    const query = await listar();
    const query2 = await listarg();
    const query3 = await listarDinamic("retiros");
    let sumatotal = [];
    let ivgs = [];
    let sumaconigv = [];
    let sumasinigv = [];
    let sumacondepo = [];
    let sumasindepo = [];
    let gastos = [];
    let gastototal = 0;
    let igvsumados = [];
    let debiendo = []
    let retiros = [];



    query.forEach(doc => {

        if (doc.data().fechaactual === fechafort) {
            sumatotal.push(parseFloat(doc.data().acuenta))
            igvsumados.push(parseFloat(doc.data().igvsumado))
            debiendo.push(parseFloat(doc.data().debiendo))
        }

        if (doc.data().igv === 0.18 && doc.data().fechaactual === fechafort) {
            sumaconigv.push(parseFloat(doc.data().acuenta))
            ivgs.push(parseFloat(doc.data().igv))
        } else if (doc.data().igv === 0 && doc.data().fechaactual === fechafort) {
            sumasinigv.push(parseFloat(doc.data().acuenta))
        }

        if (doc.data().fechaactual === fechafort && doc.data().deposito == "si") {
            sumacondepo.push(parseFloat(doc.data().acuenta))
        } else if (doc.data().fechaactual === fechafort && doc.data().deposito == "no") {
            sumasindepo.push(parseFloat(doc.data().acuenta))
        }



    })

    query2.forEach(doc => {
        if (doc.data().fecha === fechafort) {

            gastos.push(parseFloat(doc.data().importe));
            gastototal = gastos.reduce((a, b) => a + b, 0)
        }
    })

    query3.forEach(doc => {
        if (doc.data().fecha === fechafort) {
            retiros.push(parseFloat(doc.data().retiro))
        }
    })

    let total = sumatotal.reduce((a, b) => a + b, 0)
    let totalconigv = sumaconigv.reduce((a, b) => a + b, 0)
    let totalsindepo = sumasindepo.reduce((a, b) => a + b, 0)
    let totalcondepo = sumacondepo.reduce((a, b) => a + b, 0)
    let totaldeuda = debiendo.reduce((a, b) => a + b, 0)
    let totalretirado = retiros.reduce((a, b) => a + b, 0)

    let sumaigvsumado = igvsumados.reduce((a, b) => a + b, 0)
    let totalsinigv = total - sumaigvsumado

    console.log(total, totalconigv, totalsinigv)

    if (total == 0 && gastototal == 0) {
        datoscaja.innerHTML = "Ese dia no se genero ingresos"
    } else {

        datoscaja.innerHTML = `
            <strong>Total ingreso fisico:</strong> S/. ${total}</br>
            <strong>Total con igv:</strong> S/. ${sumaigvsumado}</br>
            <strong>Total sin igv:</strong> S/. ${totalsinigv}</br>
            <strong>Total sin deposito:</strong> S/. ${totalsindepo}</br>
            <strong>Total con deposito:</strong> S/. ${totalcondepo}</br>
            <strong>Total de Gastos:</strong> S/. ${gastototal}</br>
        `
        regcaja(fechafort, total, sumaigvsumado, totalsinigv, totalsindepo, totalcondepo, gastototal, totaldeuda, totalretirado);
    }
}


async function regcaja(id, total, totalconigv, totalsinigv, totalsindepo, totalcondepo, gastototal, totaldeuda, totalretirado) {
    await registrarcaja(id, {
        total,
        totalconigv,
        totalsinigv,
        totalsindepo,
        totalcondepo,
        gastototal,
        totaldeuda,
        totalretirado
    })
    $("#alertacaja").html("Guardado..");
    toastr.success('Guardado...')
}


async function mostrardatos(id) {
    const doc = await obtenerservicio(id)
    if (doc.data().estado == "Pago Completo" || doc.data().estado == "Debiendo" || doc.data().estado == "Cancelado") {
        Swal.fire({
            html: `
            <div class="text-left">
                <div class="card">
                    <div class="card-header">
                     Datos del Cliente
                    </div>
                    <div class="card-body">
                    <strong>Direccion:</strong>  ${doc.data().direccion}</br>
                    <strong>Telefono:</strong>  ${doc.data().telefono}</br>
                    <strong>Descripcion:</strong>  ${doc.data().detalle}</br>
                    <strong>Igv:</strong>  ${doc.data().igv}</br>
                    <strong>saldo:</strong> S/. ${doc.data().debiendo}</br>
                    <strong>Deposito:</strong>  ${doc.data().deposito}</br>
                    <strong>Fecha de Entrega:</strong> ${doc.data().fechaentrega}</br>
                    <strong>Hora de Entrega:</strong>  ${doc.data().hora}
                    </div>
                </div>
            </div>
            `,
            showConfirmButton: false,
        })

    } else {
        Swal.fire({
            html: "<h3>Esto es una deuda cancelada</h3>",
            showConfirmButton: false,
        })

    }

}

function mayusculas(e) {
    e.value = e.value.toUpperCase();
}

function validarmontos() {
    const tratoinicial = document.getElementById("tratoinicial");
    const acuenta = document.getElementById("acuenta");
    const igv = document.getElementById("igv");

    if (parseFloat(tratoinicial.value) < parseFloat(acuenta.value)) {
        Swal.fire({
            title: "Cuidado",
            text: "El numero ingreso es mayor que el trato inicial",
            icon: "warning"
        })

        acuenta.value = ""
    }



    console.log(tratoinicial.value, acuenta.value);
}

async function calularigv() {


    const igv = document.getElementById("igv");
    const igvsumado = document.getElementById("igvsumado");
    const tratoinicial = document.getElementById("tratoinicial");


    let a = 0;
    let insert = parseFloat(tratoinicial.value);

    if (editstatus == false) {
        if (igv.checked == true) {

            a = insert * 0.18
            tratoinicial.value = insert + a;
            igvsumado.value = a;
        } else {
            tratoinicial.value = tratoinicial.value - igvsumado.value;
        }
    } else {
        console.log("gaa")
        const doc = await obtenerservicio(idg);

        if (igv.checked == false) {
            tratoinicial.value = parseFloat(tratoinicial.value) - parseFloat(igvsumado.value)
        } else {
            a = insert * 0.18
            igvsumado.value = a;
            tratoinicial.value = parseFloat(tratoinicial.value) + parseFloat(igvsumado.value);
        }
    }

}

async function montoDeposito() {

    $('#titulo').html('<i class="fas fa-spinner fa-spin"></i> Cargando...')

    const query = await listar()
    datos = [];
    retirados = [];
    query.forEach(doc => {
        if (doc.data().deposito === "si") {
            datos.push(parseFloat(doc.data().acuenta))
        }
    })

    const query2 = await listarDinamic("retiros")
    query2.forEach(doc => {
        retirados.push(parseFloat(doc.data().retiro))
    })

    let totalmonto = datos.reduce((a, b) => a + b, 0)
    let totalretiros = retirados.reduce((a, b) => a + b, 0)

    let final = totalmonto - totalretiros;

    await registrarMontoDeposito("monto", {
        totalmonto: final.toFixed(2)
    })

    $('#titulo').html("Monto Total: S/. <span style='background-color:yellow'>" + final.toFixed(2) + "</span>");

}

const formretiro = document.getElementById('formretiro')

$('#formretiro').submit(async function (e) {
    e.preventDefault();

    $('#btnretirar').attr('disabled', true);

    let resta = 0;

    const numretiro = formretiro['numretiro'].value;

    const doc = await obtenerDinamic("monto", "Montodeposito");

    let montototal = parseFloat(doc.data().totalmonto)
    if (montototal >= numretiro) {
        resta = montototal - numretiro

        await registroDinamic("retiros", {
            fecha: fechaactualglobal,
            retiro: numretiro
        })

        toastr.success('Retiro realisado correctamente')

        formretiro.reset();
        montoDeposito()
        $('#btnretirar').attr('disabled', false);

    } else {
        toastr.error('El retiro ingresado es mayor que el monto')
        $('#btnretirar').attr('disabled', false);
    }


});

