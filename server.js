require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/admin", require("./src/routes/admin.routes"));
app.use("/api/manager", require("./src/routes/manager.routes"));
app.use("/api/maintenance", require("./src/routes/maintenance.routes"));
app.use("/api/reports", require("./src/routes/reports.routes"));
app.use("/api/sub-manager", require("./src/routes/subManager.routes"));



// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
