// Multicast AMCP for CasparCG
var network = require('network');
var dgram = require('dgram'); 
var net = require('net');
 
var sockets = [];
var PORT = 45250;
var MCAST_ADDR = "239.1.2.3";
var MCAST_SETUP = false;

var server = dgram.createSocket({ type: 'udp4', reuseAddr: true })

var log = console.log;

console.log = function () {
    var first_parameter = arguments[0];
    var other_parameters = Array.prototype.slice.call(arguments, 1);

    function formatConsoleDate (date) {
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var milliseconds = date.getMilliseconds();

        return '[' +
               ((hour < 10) ? '0' + hour: hour) +
               ':' +
               ((minutes < 10) ? '0' + minutes: minutes) +
               ':' +
               ((seconds < 10) ? '0' + seconds: seconds) +
               '.' +
               ('00' + milliseconds).slice(-3) +
               '] ';
    }

    log.apply(console, [formatConsoleDate(new Date()) + first_parameter].concat(other_parameters));
};

network.get_active_interface(function(err, obj) {  // This is a quick fix to support systems with multiple NIC's [like most of my systems] and tries to select the active interface as the multicast interface - better suggestions wanted!
  server.bind(PORT, function(){
    server.setBroadcast(true);
    server.setMulticastTTL(63);
    server.setMulticastLoopback(true);
    server.addMembership(MCAST_ADDR);
    server.setMulticastInterface(obj.ip_address);
  });
  MCAST_SETUP = true;
})

function broadcastNew(msg) {
  if(MCAST_SETUP) {
    var message = new Buffer(msg);
    server.send(message, 0, message.length, PORT, MCAST_ADDR);
    console.log("Sending " + message);
  } else {
    return 'ERROR: Multicast interface not setup';
  }
}

function receiveData(data) {
  for(var i = 0; i<sockets.length; i++) {
    var cmd = data.toString();
    broadcastNew(cmd);
    console.log(cmd);
    sockets[i].write('200 OK\r\n');
  }
}
 
function newSocket(socket) {
  sockets.push(socket);
  socket.on('data', function(data) { receiveData(data); });
}
 
var telnetServer = net.createServer(newSocket);
 
telnetServer.listen(15250);