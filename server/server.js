const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors")
const historyRoutes = require("./routes/historyRoutes");




dotenv.config();
connectDB();

const app = express();
app.use(express.json()); // Parse JSON request body
app.use(cors()); // Allow requests from frontend


app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/history", historyRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
