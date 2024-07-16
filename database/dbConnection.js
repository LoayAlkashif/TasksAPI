import { connect } from "mongoose";

export const dbConnection = connect("mongodb://localhost:27017/taskAPI")
  .then(() => {
    console.log("Database connected...");
  })
  .catch((err) => console.log("error", err));
