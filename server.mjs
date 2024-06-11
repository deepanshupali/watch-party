import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import { dbConnect } from "./lib/dbConnect";
import { Register } from "./lib/models/Register";
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// Function to update user status
const updateUserStatus = async (email, status) => {
  try {
    await dbConnect();
    await Register.findOneAndUpdate({ email }, { status });
  } catch (error) {
    console.error(`Failed to update status for ${email}:`, error);
  }
};

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handler(req, res);
  });

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("user login", async (email) => {
      console.log(`${email} is online`);
      await updateUserStatus(email, "online");
      socket.broadcast.emit("user online", email);
    });

    socket.on("user logout", async (email) => {
      console.log(`${email} is offline`);
      await updateUserStatus(email, "offline");
      socket.broadcast.emit("user offline", email);
    });

    socket.on("disconnect", async () => {
      // Handle user disconnect logic here
      // This requires that you somehow track the email associated with the socket
      const email = socket.handshake.query.email;
      if (email) {
        console.log(`${email} has disconnected`);
        await updateUserStatus(email, "offline");
        socket.broadcast.emit("user offline", email);
      }
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
