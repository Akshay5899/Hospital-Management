import mongoose from "mongoose";

export const dbConnection = () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not defined in environment variables.");
    return;
  }

  if (process.env.MONGO_URI.includes("YOUR_CLUSTER_HOSTNAME")) {
    console.error(
      "MONGO_URI contains a placeholder host name. Replace YOUR_CLUSTER_HOSTNAME with your actual MongoDB cluster host."
    );
    return;
  }

  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "hospital",
    })
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((err) => {
      console.log("Some error occured while connecting to database:", err);
    });
};
