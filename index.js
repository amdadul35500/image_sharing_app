const express = require("express");
const dotenv = require("dotenv");
const app = express();
const path = require("path");
const cors = require("cors");
const connectionDb = require("./config/db");
const filesRoute = require("./routes/files");
const showRoute = require("./routes/show");
const downloadRoute = require("./routes/download");

const PORT = process.env.PORT || 5000;

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

connectionDb();

// set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/api/files", filesRoute);
app.use("/files", showRoute);
app.use("/files/download", downloadRoute);

// home route
app.get("/", (req, res) => {
  res.render("upload");
});

// not foundHandler
app.use((req, res, next) => {
  res.status(404).send("Request url was not found !");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
