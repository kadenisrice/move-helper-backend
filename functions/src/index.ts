import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import accountRouter from "./routes/AccountRouter";
import tipsRouter from "./routes/TipRouter";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", accountRouter);
app.use("/", tipsRouter);

export const api = functions.https.onRequest(app);
