const { Router, json, urlencoded } = require("express");

module.exports = Router()
  .use(json())
  .use(urlencoded({ extended: false }))
  .use("/v1.0", require("./v1"))
  .use("", (_, res) => {
    res.send('welcome to the api')
  })
