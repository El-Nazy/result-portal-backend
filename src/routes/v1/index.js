const { Router, json, urlencoded } = require("express");

module.exports = Router()
  .use(
    "/:school",
    Router({ mergeParams: true })
      .use("/auth", require("./auth-routes"))
      // .use("/teachers/dashboard", require("./teachers-dashboard.js"))
      .use("/dashboard", require("./dashboard-routes.js"))
      .use("/students", require("./students-routes.js"))
      .use("", (req, res) => {
        res.send("welcome to " + req.params.school);
        // console.log(req)
      })
  )
  .use("", (_, res) => {
    res.send("welcome to v1.0");
  });
