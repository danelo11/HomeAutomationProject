const noble = require('@abandonware/noble');
const bleno = require('@abandonware/bleno');
const util = require('util');

//devices
var devices = ['f0:14:fa:87:35:f2'];

noble.on('stateChange', async (state) => {
  if (state === 'poweredOn') {
    await noble.startScanningAsync([], true);
  }else{
    await noble.stopScanningAsync();
  }
});

noble.on('discover', async (peripheral) => {
    for (var i=0;i<devices.length;i++) {
        if([peripheral.address] == devices[i]){
            console.log(`Peripheral with ID ${peripheral.id} found`);
            const advertisement = peripheral.advertisement;
            const localName = advertisement.localName;
            const txPowerLevel = advertisement.txPowerLevel;
            const manufacturerData = advertisement.manufacturerData;
            const serviceUuids = advertisement.serviceUuids;
            if (localName) {
            console.log(`  Local Name        = ${localName}`);
            }

            if (txPowerLevel) {
            console.log(`  TX Power Level    = ${txPowerLevel}`);
            }

            if (manufacturerData) {
            console.log(`  Manufacturer Data = ${manufacturerData}`);
            }
  
            if (serviceUuids) {
              console.log(`  ServiceUuids = ${serviceUuids}`);
            }
            peripheral.connect(function(errcon){
              console.log('Connecting to peripheral: ' + peripheral.uuid);
              pairinfo(peripheral);
            })    
        }
    }
    
});

//configuracion
const pairinfo = (peripheral) => {
  console.log("Pairing device");
  peripheral.discoverServices(['ff80'], function(error, services) {
    var PairingService = services[0];
    PairingService.discoverCharacteristics(['ff8b', 'ff8a', 'ff81', 'ff84', 'ff88', 'ffff', 'ff93', 'ffe1', 'ffe2', 'ffe3', 'ff91'], function(error, characteristics) {
      for (const characteristic of characteristics) {
        if(characteristic.uuid == 'ff8b'){
          characteristic.write(new Buffer.from(['0xff']), true, function(errnoti){
            if(errnoti){
              console.log('Error al notificar');
            }
          })
          characteristic.once('write', function(){
            console.log('Notificado');
          });
        }
        if(characteristic.uuid == 'ff8a'){
          characteristic.write(new Buffer.from(['0x383838383838']), true, function(errorpair){
            if(errorpair){
              console.log('Error al emparejar');
            }
          })
          characteristic.once('write', function(){
            console.log('Emparejado');
          });
        }
        if(characteristic.uuid == 'ff81'){
          characteristic.read(function(error, data) {
            const IBeaconUUID = new Buffer.from(data);
            console.log('IBeaconUUID: ' + IBeaconUUID);
          });
        }
        if(characteristic.uuid == 'ff84'){
          characteristic.write(new Buffer.from(['0x4006']), true, function(errint){
            if(errint){
              console.log('Error al establecer el broadcast interval');
            }
          })
          characteristic.once('write', function(){
            console.log('Broadcast modificado');
          });
        }
        if(characteristic.uuid == 'ff88'){
          characteristic.read(function(error, data) {
            const Name = new Buffer.from(data);
            console.log('Device name: ' + Name);
          });
        }
        if(characteristic.uuid == 'ffff'){
          characteristic.write(new Buffer.from(['0x00']), true, function(errmode){
            if(errmode){
              console.log('Error al establecer el modo');
            }
          })
          characteristic.once('write', function(){
            console.log('Modo modificado');
          });
        }
        if(characteristic.uuid == 'ff93'){
          characteristic.write(new Buffer.from(['0xff0005']), true, function(errace){
            if(errace){
              console.log('Error al activar acelerometro');
            }
          })
          characteristic.once('write', function(){
            console.log('Acelerometro ON');
          });
        }
        if(characteristic.uuid == 'ffe1'){
          characteristic.write(new Buffer.from(['0x01']), true, function(erradv){
            if(erradv){
              console.log('Error al activar advertising mode');
            }
          })
          characteristic.once('write', function(){
            console.log('Advertising mode ON');
          });
        }
        if(characteristic.uuid == 'ffe2'){
          characteristic.write(new Buffer.from(['0x5']), true, function(errmode){
            if(errmode){
              console.log('Error al modificar intervalo advertising');
            }
          })
          characteristic.once('write', function(){
            console.log('Advertising interval configured');
          });
        }
        if(characteristic.uuid == 'ffe3'){
          characteristic.write(new Buffer.from(['0x0a00']), true, function(errmode){
            if(errmode){
              console.log('Error setting Watchdog Keepalive');
            }
          })
          characteristic.once('write', function(){
            console.log('Watchdog Keepalive configured');
          });
        }
        if(characteristic.uuid == 'ff91'){
          characteristic.write(new Buffer.from(['0xff']), true, function(errmode){
            if(errmode){
              console.log('Error setting temp & humi');
            }
          })
          characteristic.once('write', function(){
            console.log('Temperature and Humidity ON');
          });
        }
      }
    });
  });
}

function disconnect(peripheral){
  peripheral.disconnect(function(errdis){
    console.log('Disconnecting peripheral: ' + peripheral.uuid);
  })
}

