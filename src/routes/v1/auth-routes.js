const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = Router({ mergeParams: true }).post(
  "/signin",
  async function (req, res) {
    const { login, password } = req.body;
    // console.log(req.body, req.params);

    if (!password) {
      return res.status(400).send({ message: "password can't be empty" });
    }

    const db = (await process.dbClient.connect()).db(req.params.school);
    let userDoc = await db.collection("users").findOne({ login });

    if (!userDoc) {
      return res.status(404).send({ message: "user does not exist" });
    }

    if (!userDoc.passwordHash) {
      console.log("no password, creating on first login");
      await db.collection("users").updateOne(
        { _id: userDoc._id },
        {
          $set: {
            passwordHash: await bcrypt.hash(
              password,
              Number(process.env.SALT_ROUNDS)
            ),
          },
        }
      );
    } else if (!bcrypt.compareSync(password, userDoc.passwordHash)) {
      return res.status(400).send({ message: "Incorrect login or password" });
    }

    delete userDoc.passwordHash;
    console.log("password matched, creating signing token");

    let authToken = jwt.sign(userDoc, process.env.JWT_SECRET_KEY, {
      expiresIn: `${process.env.JWT_DAYS_DURATION}d`,
    });

    return res.status(200).send({
      message: "Success",
      authToken,
      expiresIn: process.env.JWT_DAYS_DURATION,
    });
  }
);
