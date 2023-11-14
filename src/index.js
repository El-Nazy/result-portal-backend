const {
  env,
  connectDb,
} = require("./config");
const express = require("express");
require("express-async-errors");
const cors = require("cors");
const morgan = require("morgan");
const apiRoutes = require("./routes");

const app = express();
connectDb();

app.use(morgan("dev"));

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", async (_, res) => {
  res.status(200).send("Welcome to the Result Portal Backend :)");
});

app.use("/api", apiRoutes);

app.all("*", (_, res) => res.status(404).send({ message: "route not found" }));

app.use((err, req, res) => {
  console.log("\n\n\na very serious error occurred\n", err, "\n\n\n")
  res.status(400).end();
});

app.listen(env.PORT, () => {
  console.log(
    `Listening on port:${env.PORT}${
      env.NODE_ENV === "development"
        ? `\nVisit http://localhost:${env.PORT}/`
        : ""
    }`
  );
});
