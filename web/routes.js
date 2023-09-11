const express = require("express");
const app = express();
const authRoutes = require("./authRoutes")
const userRoutes = require("./userRoutes")
const postRoutes = require("./postRoutes")

app.use("/api", (req, res) => {
  res.status(200).json({msg: "Success"});
});
app.use("/auth", authRoutes)
app.use("/user", userRoutes)
app.use("/post", postRoutes)


module.exports = app;