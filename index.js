import express from "express";
import bodyParser from "body-parser";

import routes from "./routes/logic.js";

const app = express();
const PORT = 8000;

app.use(bodyParser.json());

app.use("/users", routes);

app.listen(PORT, () => console.log("Server is running"));
