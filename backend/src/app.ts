import express from "express";
import dotenv from "dotenv";
import { HttpError } from "http-errors";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "morgan";
import bodyParser from "body-parser";
import { database } from "./configurations";
import userRoutes from "./routes/userRoute/userRoutes"
import taskRoutes from "./routes/taskRoute/taskRoutes"
import taskLogRoutes from "./routes/taskLogRoute/taskLogRoutes"
import "./controllers/TaskExecution/ExecuteTask"

const app = express();

dotenv.config();
app.use(bodyParser.json());
dotenv.config();
app.use(bodyParser.json());

app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/taskslog", taskLogRoutes);

database
  .sync({})
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err: HttpError) => {
    console.log(err);
  });

app.listen(process.env.PORT, () => {
  console.log(`server running on ${process.env.PORT}`);
});

export default app;