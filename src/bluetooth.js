const noble = require('@abandonware/noble');

var ids = ['f0:14:fa:87:35:f2'];
var allowDuplicates = true;

noble.on('stateChange', async function state(state, errStates){
    try{
        if(state == 'poweredOn'){
            const peripheral = await noble.startScanningAsync([], allowDuplicates)
            .then(function(){
                console.log("Start scanning...");
            })
        }else if(state == 'powerOff'){

        }
    }catch(errStates){
        console.log(errStates);
    }
});

noble.on('discover', async function discovery(peripheral){
    for (var i=0;i<=ids.length;i++){
        if(peripheral.address == ids[i]){
            console.log(peripheral);
            /*console.log(`\t${JSON.stringify(devices.advertisement.localName)}`);
            console.log(`\t${JSON.stringify(devices.advertisement.serviceData)}`);*/
            console.log(`\t${JSON.stringify(peripheral.advertisement)}`); 
        }
    }  
})

noble.on('scanStart', function() { 
    
});

noble.on('scanStop', function() { 
    console.log("Scanning stopped.");
});



