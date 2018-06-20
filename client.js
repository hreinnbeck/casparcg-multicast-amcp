var dgram = require('dgram');
const {CasparCG, AMCP} = require("casparcg-connection");

var PORT = 45250;
var MCAST_ADDR = "239.1.2.3";

var caspar = new CasparCG( { host: '127.0.0.1', debug: true } );

var client = dgram.createSocket({ type: 'udp4', reuseAddr: true })

client.on('listening', function () {
    var address = client.address();
    console.log('Listening on ' + address.address + ":" + address.port);
    client.setBroadcast(true)
    client.setMulticastTTL(63); 
    client.addMembership(MCAST_ADDR);
});

client.on('message', function (message, remote) {
	caspar.do( new AMCP.CustomCommand( '' + message ) );
    console.log('Received from: ' + remote.address + ':' + remote.port +' - ' + message);
});

client.bind(PORT);