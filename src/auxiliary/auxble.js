const noble = require('@abandonware/noble');

async function pair(){
    noble.on('discover', function(peripheral){
        await peripheral.connectAsync();
        const comprobacion = peripheral.readHandle('0037', async function (errorNotiReading){
            if(errorNotiReading){
                return errorNotiReading;
            }else{
                peripheral.once('handleRead<0037>', async function(comprobacion){
                    if(comprobacion != 'ff'){
                        await peripheral.writeHandle('0037', 'ff', false, async function(errorNotiWritting){
                            if(errorNotiWritting){
                                return errorNotiWritting;
                            }else{
                                peripheral.once('handleWrite<0037>', async function(){
                                    var compdes = await peripheral.readHandle('0037');
                                    console.log(compdes);
                                })
                            }
                        })
                    }
                })
            }
        });
        const lectura = peripheral.readHandle('0034', async function(errorReading){
            if(errorReading){
                return errorReading;
            }else{
                peripheral.once('handleRead<0034>', async function(){
                    await peripheral.writeHandle('0034', '383838383838', false, async function(errorWritting){
                        if(errorWritting){
                            return errorWritting;
                        }else{
                            peripheral.once('handleWrite<0034>', async function(){
                                    var compdes = await peripheral.readHandle('0034');
                                    console.log(compdes);
                                })
                            }
                    })
                })
            }
        });
    })
}