import net from 'net';

const client = [];
const server = net.createServer((Socket) => {
    console.log("client connected");

    socket.write("enter your name: ");

    socket.on("data", (chuck) => {
        const message = chuck.toSring().trim();

        // first message from the client is their username
        if(!socket.username) {
            socket.username = message;
            client.push(socket);

            // welcome the  user to chat room and information about the chat room
            socket.write(`welcome ${socket.username} to the chat roomm!`);
            socket.write("now you can chat\n");

            console.log(`${socket.username} joined the chat room`);
            console.log(`total clients: ${client.length}`);

            // notify other clients about the new user
            client.forEach((client) => {
                if(client !== socket) {
                    client.write(`${socket.username} has joined the chat room\n`);
                }
            });
            return;
        }

        
    })
})