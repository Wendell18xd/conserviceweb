auth.onAuthStateChanged(user =>{
    if(!user){
        window.location = "../index.html"
    }
})

const listar = (tabla) => db.collection(tabla).get();

async function listartabla() {

    reg = [];

    const query = await listar("caja");

    query.forEach(doc => {
        reg.push({
            fecha: doc.id,
            total: "S/. " + (parseFloat(doc.data().totalsindepo) + parseFloat(doc.data().totalconigv)),
            totalconigv: "S/. " + doc.data().totalconigv,
            gastototal: "S/. " + doc.data().gastototal,
            totaldeuda: "S/. " + doc.data().totaldeuda,
            totalcondepo: "S/. " + doc.data().totalcondepo,
            totalretirado: "S/. " + doc.data().totalretirado,
            saldos: (parseFloat(doc.data().totalsindepo) + parseFloat(doc.data().totalconigv)) - parseFloat(doc.data().gastototal)
        })
    })
    datatable(reg)
    document.getElementById("listatabla").innerHTML = ''
}

function datatable(reg) {

    $('#listacaja').DataTable({
        data: reg,
        columns: [
            { data: 'fecha' },
            { data: 'total' },
            { data: 'totalconigv' },
            { data: 'gastototal' },
            { data: 'totaldeuda' },
            { data: 'totalcondepo' },
            { data: 'totalretirado' },
            { data: 'saldos' }
        ],
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

$(document).ready(function () {

    $(".encabesado").load("./encabezado.html");
    document.getElementById("listatabla").innerHTML = '<h3><i class="fas fa-spinner fa-spin"></i> Cargando......</h3>'
    listartabla();

});

