const { Router } = require("express");
const { ObjectId } = require("mongodb");

module.exports = Router({ mergeParams: true }).patch(
  "/:studentId",
  async function (req, res) {
    const { school, studentId } = req.params;
    const { record } = req.body;
    
    console.log("params", req.params, "\nbody", req.body)

    const db = (await process.dbClient.connect()).db(school);
    let studentUpdate = await db.collection("users").updateOne({ _id: new ObjectId(studentId) }, {
      $set: {
        record,
      }
    });

    if (!studentUpdate.acknowledged) {
      return res.status(404).send({ message: "student does not exist" });
    }

    return res.status(200).send({
      message: "Success",
    });
  }
).patch(
  "/:studentId/:remarkType",
  async function (req, res) {
    const { school, studentId, remarkType } = req.params;
    req.body[remarkType];
    
    console.log("params", req.params, "\nbody", req.body)

    const db = (await process.dbClient.connect()).db(school);
    let studentUpdate = await db.collection("users").updateOne(
      { _id: new ObjectId(studentId) },
      {
        $set: {
          [remarkType]: req.body[remarkType],
        },
      }
    );

    if (!studentUpdate.acknowledged) {
      return res.status(404).send({ message: "student does not exist" });
    }

    return res.status(200).send({
      message: "Success",
    });
  }
);
