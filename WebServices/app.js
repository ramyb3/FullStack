const dotenv = require("dotenv");
dotenv.config();

require("./configs/database");
const subsRouter = require("./routers/subscriptions");

const express = require("express");
const app = express();

app.use(express.json());
app.use("/subscriptions", subsRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log("https Server listening on port: " + PORT));
