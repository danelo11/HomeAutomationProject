const OpenZwave = require('openzwave-shared');
const os = require('os');
const ZwaveSensor = require('./models/zwavesensor');
const ZwaveMeasurement = require('./models/measurement');

const { Types } = require('mongoose');
var medidas = [];
var sensors = [];
var listado = []; 
var actualids = [];
var zwave = new OpenZwave({
     NetworkKey: "0x88,0x79,0x3f,0x32,0x36,0xec,0xd8,0x2e,0x00,0x08,0xa8,0x66,0xbb,0x08,0x57,0x95,",
     DriverMaxAttempts: "3",
     ConsoleOutput: true,
     Logging: true, 
     SaveConfiguration: true,
     AssumeAwake: true
});

zwavedriverpaths = {
    "linux": '/dev/ttyACM0',
    "win32": '\\\\.\\COM3'
}

//Driver events
zwave.on('connected', function(version){
    console.log("The OPZW driver is connected, its version=",version);
});

zwave.on('driver ready', function(homeid){
    console.log('scanning homeid=0x%s...', homeid.toString(16));
});

zwave.on('driver failed', function(){
    console.log('failed to start driver');
});

zwave.on('scan complete', function(){
    console.log('Network scan has finished');
})

//Node events
zwave.on('node added', function(nodeid) {
    sensors[nodeid] = {
        id: nodeid,
		manufacturer: '',
		manufacturerid: '',
		product: '',
		producttype: '',
        productid: '',
        type: '',
        classes: {},
		ready: false
    };
    actualids.push(nodeid);

});

zwave.on('value added', function(nodeid, comclass, valueId) {
    if (!sensors[nodeid]['classes'][comclass])
        sensors[nodeid]['classes'][comclass] = {};
    sensors[nodeid]['classes'][comclass][valueId.index] = valueId;
});

zwave.on('value changed', changes= async function(nodeid, comclass, value) {
    //Cambios de valor
    if (sensors[nodeid]['ready']) {
        const sensorid = nodeid;
        const tag = value['label'];
        const oldvalue = Number(sensors[nodeid]['classes'][comclass][value.index]['value']);
        const newvalue = Number(value['value']);
        const fecha = new Date();
        const measurement = new ZwaveMeasurement({sensorid, tag, oldvalue, newvalue, fecha});
        medidas.push(measurement);
        console.log(measurement);
        await measurement.save();
        module.exports = {measurement};
    }
    sensors[nodeid]['classes'][comclass][value.index] = value;
});

zwave.on('value removed', function(nodeid, comclass, index) {
    if (sensors[nodeid]['classes'][comclass] &&
        sensors[nodeid]['classes'][comclass][index])
        delete sensors[nodeid]['classes'][comclass][index];        
});

zwave.on('node ready', async function(nodeid, nodeinfo){
    sensors[nodeid]['id'] = nodeid;
    sensors[nodeid]['manufacturer'] = nodeinfo.manufacturer;
    sensors[nodeid]['manufacturerid'] = nodeinfo.manufacturerid;
    sensors[nodeid]['product'] = nodeinfo.product;
    sensors[nodeid]['producttype'] = nodeinfo.producttype;
    sensors[nodeid]['productid'] = nodeinfo.productid;
    sensors[nodeid]['type'] = nodeinfo.type;
    sensors[nodeid]['ready'] = true;
    const id = nodeid;
    const manufacturer = nodeinfo.manufacturer;
    const manufacturerid =nodeinfo.manufacturerid;
    const product =nodeinfo.product;
    const producttype = nodeinfo.producttype;
    const productid =nodeinfo.productid;
    const type =nodeinfo.type;
    const ready = true;
    const nuevosensor = new ZwaveSensor({id, manufacturer, manufacturerid, product, producttype, productid, type, ready});
    ZwaveSensor.find({id: id}, async(err, sen) => {       
        if(sen.length == 0){
            listado.push(nuevosensor);
            await nuevosensor.save();
            console.log("Sensor registrado");
        }else{
            console.log("El sensor: %d ya esta registrado", nodeid);
        }
    })
    for (var i=0;i<sensors.length;i++){
        console.log(sensors[i]);
    }
    for (comclass in sensors[nodeid]['classes']) {
        console.log('node%d: class %d', nodeid, comclass);
        switch (comclass) {      
            case 48:
                var valueIds = sensors[nodeid]['classes'][comclass][index];
            for (valueId in valueIds) {
              zwave.enablePoll(valueId);
              break;
            }
          case 49: // COMMAND_CLASS_SWITCH_MULTILEVEL
            var valueIds = sensors[nodeid]['classes'][comclass][index];
            for (valueId in valueIds) {
              zwave.enablePoll(valueId);
              break;
            }
        }
    }
    var todos = await ZwaveSensor.find({},{_id:0, id: 1});
    var identis = [];
    for (r=0;r<todos.length;r++){
        const ident =todos[r]['id'];
        identis.push(ident)
        if(todos[r]['classes'] == {}){
            const aa = todos[r]['id'];
            console.log(aa);
            identis.push(aa);
        }
    }
    for (z=0;z<identis.length;z++){
        if(!actualids.includes(identis[z])){
            const ideliminiar = identis[z];
            const idunicotag = await ZwaveSensor.find({id: ideliminiar}, {_id: 1});
            for (var t=0;t<idunicotag.length;t++){
                idunico = idunicotag[t]['_id']
                console.log(idunico)
                console.log("Deleting sensor with id: %d", ideliminiar);
                await ZwaveSensor.findByIdAndDelete({_id: idunico});
            }
        }

    }
    module.exports = {listado};
});

zwave.on('notification', function(nodeid, notif) {
    switch (notif) {
        case 1:
            console.log('node%d: Smoke Alarm Alert', nodeid);
            break;
        case 4:
            console.log('node%d: Heat Alerts', nodeid);
            break;
        case 5:
            console.log('node%d: Water Alerts', nodeid);
            break;
        case 6:
            console.log('node%d: Access Control Alerts', nodeid);
            break;
        case 7:
            console.log('node%d: Home Security Alerts', nodeid);
            break;
        case 8:
            console.log('node%d: Power Management Alerts', nodeid);
            break;
        case 9:
            console.log('node%d: System Alerts', nodeid);
            break;
        case 256: 
            console.log('node%d: Previous Event', nodeid);
            break;
    }
});

zwave.on('node available', function(nodeid, nodeinfo){
    console.log('El sensor cuyo nodeid es: %d está listo para usarse', nodeid);
});

zwave.connect(zwavedriverpaths[os.platform()]);
