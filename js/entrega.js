auth.onAuthStateChanged(user =>{
    if(!user){
        window.location = "../index.html"
    }
})

$(document).ready(function () {
    $(".encabesado").load("./encabezado.html");

    listartabla();
    horaactual();
    calculo();

});

const listar = () => db.collection("servicios").get();
let horasplit = [];
let datos = [];

function horaactual() {
    let hoy = new Date();
    let hora = hoy.getHours() + ":" + hoy.getMinutes() + ":" + hoy.getSeconds();

    //console.log(hora);

    $("#reloj").html(hora);

    horasplit = hora.split(":");

    setTimeout("horaactual()", 1000)

}

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



async function listartabla() {

    const query = await listar();
    console.log("Leyendo de la base de datos");

    datos = []
  

    query.forEach(doc => {

        datos.push({
            fechaactual: doc.data().fechaactual,
            fechaentrega: doc.data().fechaentrega,
            hora: doc.data().hora,
            estado:doc.data().estado
        })

    })

}


function calculo() {

    document.getElementById("prueba").innerHTML = ""

    voltfe = [];
    horas = [];

    let minuto = "";
    let hora = "";
    let recons = "";
    let fhora = "";
    let fminuto = "";
    let color = "";
    let finalhor = "";

    datos.forEach(function (elemento, indice, array) {

        

        voltfe = elemento.fechaentrega.split("-")
        horas = elemento.hora.split(":");

        recons = voltfe[2] + "-" + voltfe[1] + "-" + voltfe[0]

        if (fechaactual() === recons && elemento.estado !== " ") {
        
            minuto = parseInt(horas[1]) - parseInt(horasplit[1])
            hora = parseInt(horas[0]) - parseInt(horasplit[0]);

            if (minuto < 0) {
                hora--
                minuto = 60 + minuto;
            }

            fhora = hora.toString();
            fminuto = minuto.toString();

            if (fhora.length < 2) {
                fhora = "0" + fhora;
            }

            if (fminuto.length < 2) {
                fminuto = "0" + fminuto;
            }

            finalhor = fhora + ":" + fminuto;

            if (hora <= 0 && parseInt(fminuto) > 30 && Math.sign(fhora) !== -1) {
                color = "style='background-color:yellow'";
            } else if (fhora === "01" && fminuto === "00") {
                color = "style='background-color:yellow'";
            } else if (fhora === "00" && parseInt(fminuto) <= 30 && parseInt(fminuto) !== 00) {
                color = "style='background-color:orange'";
            } else if (fhora === "00" && parseInt(fminuto) === 00) {
                color = "style='background-color:red ;color:white;'";
                finalhor = "Tiempo agotado"
            } else if (Math.sign(fhora) === -1) {
                color = "style='background-color:red ;color:white;'";
                finalhor = "Tiempo agotado"
            } else {
                color = "style='background-color:lightgreen'";
                finalhor = fhora + ":" + fminuto;
            }

            document.getElementById("prueba").innerHTML += `
                <tr>
                    <td>${elemento.fechaactual}</td>
                    <td>${elemento.fechaentrega}</td>
                    <td>${elemento.hora}</td>
                    <td ${color}>${finalhor}</td>
                </tr>
            `

        }
        
    })

    setTimeout('calculo()', 1000)
}

//entragado, en proceso, pendiente, devuelto;