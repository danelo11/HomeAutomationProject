const controlador = {};
const {listado, measurement} = require('../zwave');
const Sensor = require('../models/zwavesensor');
const Measurement = require('../models/measurement');

controlador.renderMainPage = function (request, response) {
    response.render('sensores/index');
}

controlador.renderSensores = async function (request, response) {
    const sensores = await Sensor.find().lean();
    response.render('sensores/sensores', { sensores });
}

controlador.renderReal = async function (request, response) {
    var mediciones = [];
    const recover = await Measurement.find({}).sort({ sensorid: 1, tag: 1, fecha: -1 }).lean();
    var compid = "";
    var comptag = "";
    for (var i = 0; i < recover.length; i++) {
        if (compid.length == 0 && comptag.length == 0) {
            compid = recover[i]['sensorid'];
            comptag = recover[i]['tag'];
            console.log(recover[i]['fecha'])
            mediciones.push(recover[i]);
        }
        if (compid == recover[i]['sensorid'] && comptag == recover[i]['tag']) {
        } else {
            compid = recover[i]['sensorid'];
            comptag = recover[i]['tag'];
            mediciones.push(recover[i]);
        }
    }
    response.render('sensores/tiemporeal', { mediciones });

        //First try
        /*console.log(recover[i]['sensorid'], recover[i]['tag'], identificadores.includes(recover[i]['sensorid']), identificadores.includes(recover[i]['tag']));
        if(!(identificadores.includes(recover[i]['sensorid'])) && !(identificadores.includes(recover[i]['tag']))){
            console.log(identificadores.includes(recover[i]['sensorid']), identificadores.includes(recover[i]['tag']), recover[i]['sensorid'], recover[i]['tag'])
                mediciones.push(recover[i]);
                identificadores.push(recover[i]['sensorid'], recover[i]['tag']);
        }
        if((identificadores.includes(recover[i]['sensorid'])) && !(identificadores.includes(recover[i]['tag']))){
            console.log(identificadores.includes(recover[i]['sensorid']), identificadores.includes(recover[i]['tag']), recover[i]['sensorid'], recover[i]['tag'])
                mediciones.push(recover[i]);
                identificadores.push(recover[i]['sensorid'], recover[i]['tag']);             
        }
        if(!(identificadores.includes(recover[i]['sensorid'])) && (identificadores.includes(recover[i]['tag']))){
            console.log(identificadores.includes(recover[i]['sensorid']), identificadores.includes(recover[i]['tag']), recover[i]['sensorid'], recover[i]['tag'])
            mediciones.push(recover[i]);
            identificadores.push(recover[i]['sensorid'], recover[i]['tag']);
        }*/
}

controlador.renderMoni = async function (request, response) {
    var etiquetas = [];
    var info = [];
    const tags = await Measurement.find({}, { _id: 0, tag: 1 });
    const seninfo = await Sensor.find({}, { _id: 0, id: 1, product: 1 });
    for (var i = 0; i < tags.length; i++) {
        if (!etiquetas.includes(tags[i]['tag'])) {
            etiquetas.push(tags[i]['tag']);
        }
    }
    for (var j = 0; j < seninfo.length; j++) {
        if (!info.includes(seninfo[j]['id'])) {
            info.push(seninfo[j]['product']);
        }
    }
    response.render('sensores/monitoring', { info, etiquetas });

}

controlador.showMeasurements = async function (request, response) {
    const { selsensor, seltag, ordenarpor, selfecha } = request.query; //variables typeadas por el usuario
    const recid = await Sensor.find({ product: selsensor }, { _id: 0, id: 1 });
    const recovery = await Measurement.find({}).sort({ sensorid: 1, tag: 1, fecha: -1});
    if(ordenarpor == 'antiguos'){
        const recovery = await Measurement.find({}).sort({ sensorid: 1, tag: 1, fecha: 1});
    }
    var senid = 0;
    for (var h = 0; h < recid.length; h++) {
        senid = recid[h]['id'];
    }
    var fechadefinitiva = new Date(selfecha);
    console.log(fechadefinitiva);
    const solofecha = fechadefinitiva.getFullYear()+"-"+(fechadefinitiva.getMonth()+1)+"-"+fechadefinitiva.getDate();
    var resultado = [];
    for (var i = 0; i < recovery.length; i++) {
        var valesen = 0;
        var valetag = 0;
        var valefecha = 0;
        const fechabd = recovery[i]['fecha'].getFullYear()+"-"+(recovery[i]['fecha'].getMonth()+1)+"-"+recovery[i]['fecha'].getDate();
        
        if (selsensor == "todos") {
            valesen = 1;
        }
        if (selsensor != "todos" && recovery[i]['sensorid'] == senid) {
            valesen = 1;
        }
        if (seltag == "todos") {
            valetag = 1;
        }
        if (seltag != "todos" && recovery[i]['tag'] == seltag) {
            valetag = 1;
        }
        if (solofecha.length == 11) {
            valefecha = 1;
        }
        if (solofecha.length < 10  && fechabd == solofecha) {
            valefecha = 1;
        }
        if (valesen == 1 && valetag == 1 && valefecha == 1) {
            resultado.push(recovery[i])
        }
    }
    response.send({resultado})
 
}

controlador.renderConfig = function (request, response) {
    response.render('sensores/config');
}

module.exports = controlador;