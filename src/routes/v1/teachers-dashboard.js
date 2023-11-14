const { Router } = require("express");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

module.exports = Router({ mergeParams: true }).get(
  "/",
  async function (req, res) {
    const { school } = req.params;
    const { _id } = jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY);

    const db = (await process.dbClient.connect()).db(school);
    const teacher = await db.collection("users").findOne({ _id: new ObjectId(_id) });
    
    console.log("_id", _id);
    if (!teacher) console.log("teacher not found", jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY))
    console.log("teacher", teacher);
    const _class = await db.collection("classes").findOne({ _id: new ObjectId(teacher.classId) });
    console.log("_class", _class);
    const subjects = await db.collection("subjects").find().toArray();
    console.log("subjects", subjects);
    const students = await db
      .collection("students")
      .find({ classId: teacher.classId })
      .toArray();
    console.log("students", students);

    return res.status(200).send({
      firsName: teacher.firstName,
      className: _class.name,
      subjects,
      students,
    });
  }
);
