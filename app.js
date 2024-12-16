import express from "express";
import cors from "cors";
import carRoutes from "./routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", carRoutes);
app.listen(3001, () =>
  console.log("Server is running on http://localhost:3001")
);
