const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// routes
const accountRoutes = require("../features/account");
const habitRoutes = require("../features/habit");

// prefix
app.use("/account", accountRoutes);
app.use("/habit", habitRoutes);

app.get("/", (req, res) => {
  res.json({ status: "online", message: "levelio API is online" });
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
