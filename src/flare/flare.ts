import * as dgram from 'dgram';

const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

const multicastAdress = '239.255.255.3';
const multicastPort = 1998;
const payload = 'admin';
const multicastTTL = 128; // Choose your TTL (Time To Live)

socket.bind(multicastPort,() => {
  socket.addMembership(multicastAdress);
  // socket.setMulticastTTL(multicastTTL);
  const message = Buffer.from(payload);
  socket.send(
    message,
    0,
    message.length,
    multicastPort,
    multicastAdress,
    (err) => {
      if (err) {
        console.error('Error sending multicast:', err);
      } else {
        console.log('Multicast message sent successfully.');
      }

      // Close the socket
      // socket.close();
    },
  );
});


socket.on('error', (err) => {
  console.error('Socket error:', err);
});

// Handle messages received
socket.on('message', (msg, rinfo) => {
  console.log(
    `Received multicast message from ${rinfo.address}:${rinfo.port}: ${msg}`,
  );
});

export default socket;
