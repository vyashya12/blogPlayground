const express = require("express");
const mongoose = require("mongoose");
const PORT = 5000;
const app = express();
const cors = require("cors");

mongoose.connect("mongodb://localhost:27017/day3");

app.use(express.json());
app.use(cors());

app.use("/auth", require("./routes/auth"));
app.use("/posts", require("./routes/posts"));

app.listen(PORT, () => console.log("Server is running in PORT " + PORT));
mongoose.connection.once("open", () =>
	console.log("We are connected to MongoDB")
);
