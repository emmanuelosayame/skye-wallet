import express from "express";
import dotenv from "dotenv";
import accountRouter from "./router/account";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const port = process.env.PORT;

// parse application/json
app.use(bodyParser.json());

app.use("/account", accountRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
