# casparcg-multicast-amcp

server.js listens on port 15250 for AMCP commands.  You can for instance change the settings in the official CasparCG client to use port 15250.  The server only accepts commands and always replies "200 OK"

You can then run client.js on other machines in the network running CasparCG.

Any command sent to server.js should execute on all the machines running client.js.
