require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const connectDB = require("./src/config/db");
const validateEnv = require("./src/config/env");
const errorHandler = require("./src/middleware/errorHandler");
const dashboardRoutes = require("./src/routes/dashboardRoutes");

const adminReportRoutes = require("./src/routes/adminReport.routes");

// ... other app.use calls
// Validate environment variables
validateEnv();

const app = express();

// Connect Database
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration
// app.use(cors({
//   origin: process.env.CORS_ORIGIN || "*",
//   credentials: true
// }));
app.use(cors({
  origin: "*",
  credentials: true
}))


// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use("/api/", limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: "Too many login attempts, please try again later."
});
app.use("/api/auth/login", authLimiter);

// Logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/admin", require("./src/routes/admin.routes"));
app.use("/api/manager", require("./src/routes/manager.routes"));
app.use("/api/maintenance", require("./src/routes/maintenance.routes"));
app.use("/api/reports", require("./src/routes/reports.routes"));
app.use("/api/sub-manager", require("./src/routes/subManager.routes"));
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", adminReportRoutes);



// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler (must be last)
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
});
