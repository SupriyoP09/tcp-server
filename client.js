import net from 'node:net';

const client = net.createConnection({ port: 3000 }, () => {
    console.log("connected to the chat server");
});

client.on('data', (data) => {
    console.log(data.toString());
});

process.stdin.on('data', (input) => {
    client.write(input);
});

client.on('end', () => {
    console.log("disconnected from server");
});