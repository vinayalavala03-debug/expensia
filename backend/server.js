const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

dotenv.config();

const { Server: SocketIOServer } = require("socket.io");

const authRoutes = require("./routes/authRoutes.js");
const incomeRoutes = require("./routes/incomeRoutes.js");
const expenseRoutes = require("./routes/expenseRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");
const tripRoutes = require("./routes/tripRoutes.js");

const Trip = require("./models/Trip.js");
const TripMessage = require("./models/TripMessage.js");
const User = require("./models/User.js");
const { connectDB } = require("./config/db.js");

const app = express();
const server = http.createServer(app);

/* ───────────────── SECURITY + PERFORMANCE ───────────────── */

app.use(helmet());
app.use(compression());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://expensia.vercel.app",
    credentials: true,
  })
);

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Disable caching for APIs
app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

/* ───────────────── BODY PARSING ───────────────── */

app.use(express.json({ limit: "15kb" }));
app.use(express.urlencoded({ extended: true }));

/* ───────────────── DATABASE ───────────────── */

connectDB();

/* ───────────────── ROUTES ───────────────── */

app.get("/", (req, res) => res.send("API is running..."));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/trips", tripRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ───────────────── SOCKET.IO ───────────────── */

const allowedOrigin = process.env.FRONTEND_URL || "https://expensia.vercel.app";

const io = new SocketIOServer(server, {
  transports: ["websocket"], // ✅ FORCE WEBSOCKET
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
  },
});

// Make io available in controllers
app.set("io", io);

/* ─────────── SOCKET AUTH (JWT) ─────────── */

io.use((socket, next) => {
  const token =
    socket.handshake.auth?.token ||
    socket.handshake.headers?.authorization?.replace("Bearer ", "");

  if (!token) return next(new Error("unauthorized"));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = {
      id: payload.id || payload._id,
      fullName: payload.fullName || "User",
      email: payload.email,
    };

    next();
  } catch (err) {
    console.error("Socket auth failed:", err.message);
    next(new Error("unauthorized"));
  }
});

/* ─────────── SOCKET EVENTS ─────────── */

io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.user.id}`);

  /* JOIN TRIP ROOM */
  socket.on("join-trip", async (tripId) => {
    try {
      const trip = await Trip.findById(tripId).select(
        "userId participants visibility"
      );

      if (!trip) return socket.emit("error", "Trip not found");

      const uid = String(socket.user.id);
      const isCreator = String(trip.userId) === uid;
      const isParticipant = trip.participants.map(String).includes(uid);

      if (
        (trip.visibility === "private" && !isCreator) ||
        (!isCreator && !isParticipant)
      ) {
        return socket.emit("error", "Access denied");
      }

      socket.join(`trip:${tripId}`);
      socket.emit("joined", tripId);
    } catch (err) {
      console.error("Join trip error:", err);
      socket.emit("error", "Server error");
    }
  });

  /* SEND MESSAGE (OPTIMIZED & FAST) */
  socket.on("trip-message", ({ tripId, message }, ack) => {
    if (!tripId || !message) return;

    // 1️⃣ Emit instantly (Optimistic UI)
    const tempMessage = {
      _id: Date.now(),
      trip: tripId,
      message,
      user: {
        _id: socket.user.id,
        fullName: socket.user.fullName,
      },
      createdAt: new Date(),
      pending: true,
    };

    io.to(`trip:${tripId}`).emit("trip-message", tempMessage);

    // ACK to sender
    ack && ack({ delivered: true });

    // 2️⃣ Save asynchronously (NON-BLOCKING)
    process.nextTick(async () => {
      try {
        await TripMessage.create({
          trip: tripId,
          user: socket.user.id,
          message,
        });
      } catch (err) {
        console.error("Async message save failed:", err);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.user.id}`);
  });
});

/* ───────────────── START SERVER ───────────────── */

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
