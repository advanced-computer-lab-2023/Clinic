import express, { Express } from "express";
import { router } from "./routes";
import mongoose from "mongoose";
const app: Express = express();
const port = process.env.PORT || 3000;
const URL =
  process.env.URL || "mongodb+srv://admin:admin@cluster0.ugek6la.mongodb.net/";
app.use(router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });
const connection = mongoose.connection;
