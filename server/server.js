const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const historyRoutes = require("./routes/historyRoutes");
const userRoutes = require("./routes/userRoutes");

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// --- CORS Configuration using Environment Variable ---

// Get the allowed origin from the environment variable
const allowedOrigin = process.env.CLIENT_URL;

// If the CLIENT_URL is not set, log an error and exit
if (!allowedOrigin) {
  console.error("FATAL ERROR: CLIENT_URL is not defined in the environment variables.");
  process.exit(1); // Exit the process with an error code
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests from the specified origin
    if (origin === allowedOrigin || !origin) { // Also allow requests with no origin (e.g., Postman)
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE,HEAD,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

// Apply CORS middleware before any routes
app.use(cors(corsOptions));

// --- End of CORS Configuration ---


// Middleware to parse JSON request bodies
app.use(express.json());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/history", historyRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));