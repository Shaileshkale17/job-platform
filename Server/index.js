import express from "express";
import cors from "cors";
import env from "dotenv";
import Connection from "./DataBase/index.js";
import UserRouter from "./router/user.routes.js";
import JobRouter from "./router/Job.routes.js";
import ApplicationRouter from "./router/application.routes.js";
env.config();
const app = express();
app.use(
  cors({
    origin: process.env.ORIGIN || "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user/", UserRouter);
app.use("/api/job/", JobRouter);
app.use("/api/application/", ApplicationRouter);

Connection()
  .then(() => {
    app.listen(process.env.PROT || 3000, () => {
      console.log(`server runing on ${process.env.PROT || 3000}`);
    });
  })
  .catch((err) => {
    console.log(`Error ${err}`);
  });
