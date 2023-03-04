const dotenv = require("dotenv");
dotenv.config();

require("./configs/database");
const dataRouter = require("./routers/data");

const cors = require("cors");
const express = require("express");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/data", dataRouter);

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log("https Server listening on port: " + PORT));
