import net from 'net';

const client = [];
const server = net.createServer((socket) => {
    console.log("client connected");

    socket.write("enter your name: ");

    socket.on("data", (chunk) => {
        const message = chunk.toString().trim();

        // first message from the client is their username
        if(!socket.username) {
            socket.username = message;
            client.push(socket);

            // welcome and information about the chat room
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

        // private message
        if(message.startsWith("@")) {
            const parts = message.split(" ");
            const targetUsername = parts[0].substring(1);
            const privateMessage = parts.slice(1).join(" ");

            const targetClient = client.find((client) => client.username === targetUsername);
            
            if(!targetClient) {
                socket.write("user not found\n");
                return;
            }

            targetClient.write(`[Private] ${socket.username}: ${privateMessage}\n`);
            socket.write(`[Private to ${targetUsername}] ${privateMessage}\n`);
            return;
        }

        // broadcast message to all clients
        client.forEach((client) => {
            if (client !== socket) {
                client.write(`${socket.username}: ${message}\n`);
            }
        });
    });

    // client disconnection
    socket.on("end", () => {
        const index = client.indexOf(socket);
        if (index!==-1) {
            client.splice(index, 1);
        }

        if (socket.username) {
            console.log(`${socket.username} disconnected from the chat room`);

            // user leaving notification
            client.forEach((client) => {
                client.write(`${socket.username} has left the chat\n`);
            });
        }
        console.log(`total connected clients: ${client.length}`);
    });

    // error handling
    socket.on("error", (err) => {
        console.error("Error:", err.message);
    });
});

server.listen(3000, () => {
    console.log("Chat server is running on port 3000");
});