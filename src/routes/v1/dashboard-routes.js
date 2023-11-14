const { Router } = require("express");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

module.exports = Router({ mergeParams: true }).get(
  "",
  async function (req, res) {
    const { school } = req.params;
    let _id;
    try {
      _id = jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY)._id;
    } catch (error) {
      return res.status(400).end();
    }
    console.log("_id", _id);

    const db = (await process.dbClient.connect()).db(school);
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(_id) });

    if (!user) {
      console.log(
        "user not found",
        jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY)
      );
      res.status(404).end();
    }

    const dashboard = {
      name: user.name,
      userRole: user.role,
    };

    if (user.role.startsWith("teacher")) {
      console.log("teacher", user);
      const _class = await db
        .collection("classes")
        .findOne({ _id: new ObjectId(user.classId) });
      console.log("_class", _class);
      dashboard.className = _class.name;

      dashboard.subjects = [];
      for (const subjectId of _class.subjectIds) {
        dashboard.subjects.push(
          await db.collection("subjects").findOne({
            _id: new ObjectId(subjectId),
          })
        );
      }

      dashboard.psychomotorSkills = [
        {
          name: "Handwriting",
          _id: "Handwriting",
        },
        {
          name: "Verbal Fluency",
          _id: "Verbal",
        },
        {
          name: "Games",
          _id: "Games",
        },
        {
          name: "Sports",
          _id: "Sports",
        },
        {
          name: "Handing Tools",
          _id: "Handing",
        },
        {
          name: "Drawing and Painting",
          _id: "Drawing",
        },
        {
          name: "Musical Skills",
          _id: "Musical",
        },
      ];
      dashboard.effectiveAreas = [
        { name: "Punctuality", _id: "Punctuality" },
        { name: "Neatness", _id: "Neatness" },
        { name: "Politeness", _id: "Politeness" },
        { name: "Honesty", _id: "Honesty" },
        { name: "Cooperation With Others", _id: "Cooperation With Others" },
        { name: "Leadership", _id: "Leadership" },
        { name: "Helping Others", _id: "Helping Others" },
        { name: "Emotional Stability", _id: "Emotional Stability" },
        { name: "Health", _id: "Health" },
        { name: "Attitude to School Works", _id: "Attitude to School Works" },
        { name: "Attentiveness", _id: "Attentiveness" },
        { name: "Perseverance", _id: "Perseverance" },
        { name: "Speaking/Handwriting", _id: "Speaking/Handwriting" },
      ];
      dashboard.classStudents = await db
        .collection("users")
        .find({ classId: user.classId, role: "student" })
        .toArray();
    }

    if (user.role.endsWith("hm")) {
      dashboard.schoolClassStudents = [];
      const classes = await db.collection("classes").find({}).toArray();
      for (const _class of classes) {
        dashboard.schoolClassStudents.push({
          name: _class.name,
          students: await db
            .collection("users")
            .find({ classId: _class._id.toString(), role: "student" })
            .toArray(),
        });
      }
    }

    console.log("dashboard", dashboard);

    return res.status(200).send(dashboard);
  }
);

async function getDashboard(school, role) {
  switch (role) {
    case "admin":
      return await getAdminDashboard(school);
      break;
    case "teacher":
      break;
    case "student":
      break;
  }
}

async function getAdminDashboard(school) {
  const db = (await process.dbClient.connect()).db(school);

  const dashboard = {
    firstName: "Admin",
    managements: [
      {
        name: "students",
        entities: [
          {
            firstName: "mary",
            lastName: "moses",
            class: "primary 5",
            regNo: "cath-375",
          },
          {
            firstName: "david",
            lastName: "chisom",
            class: "nursery 2",
          },
        ],
      },
      {
        name: "teachers",
        entities: [
          {
            firstName: "Benjamin",
            lastName: "Sunday",
            class: "primary 5",
          },
          {
            firstName: "matthew",
            lastName: "kingsley",
            class: "nursery 2",
          },
        ],
      },
      {
        name: "classes",
        entities: [
          {
            name: "primary 5",
          },
          {
            name: "nursery 2",
          },
        ],
      },
      {
        name: "subjects",
        entities: [
          {
            name: "mathematics",
          },
          {
            name: "english language",
          },
        ],
      },
    ],
  };
  const simpleCollections = ["subjects", "classes"];

  dashboard.managements = [];
  for (const collection of simpleCollections) {
    dashboard.managements.push({
      name: collection,
      entities: await db.collection(collection).find().toArray(),
    });
    console.log(
      JSON.stringify(await db.collection(collection).find().toArray())
    );
  }

  dashboard.managements.push({
    name: "students",
    entities: await db.collection("users").find({ role: "student" }).toArray(),
  });

  dashboard.managements.push({
    name: "teachers",
    entities: await db.collection("users").find({ role: "teacher" }).toArray(),
  });

  return dashboard;
}

async function getAdminDashboard(school) {
  const db = (await process.dbClient.connect()).db(school);

  const dashboard = {
    firstName: "Teacher",
    className: "Primary 5",
    subjects: [
      {
        _id: "someid1",
        name: "English",
      },
      {
        _id: "someid2",
        name: "Mathematics",
      },
    ],
    students: [
      {
        _id: "stdndtid1",
        firstName: "mary",
        lastName: "moses",
        class: "primary 5",
        regNo: "cath-375",
        record: {
          scores: [
            {
              subject: "someid1",
              firstTest: 15,
              secondTest: 18,
              exam: 55,
            },
          ],
        },
      },
      {
        _id: "stdndtid2",
        firstName: "david",
        lastName: "chisom",
        class: "primary 5",
        record: {
          scores: [
            {
              subject: "someid2",
              firstTest: 15,
              secondTest: 18,
              exam: 55,
            },
          ],
        },
      },
    ],
  };
  const simpleCollections = ["subjects", "classes"];

  dashboard.managements = [];
  for (const collection of simpleCollections) {
    dashboard.managements.push({
      name: collection,
      entities: await db.collection(collection).find().toArray(),
    });
    console.log(
      JSON.stringify(await db.collection(collection).find().toArray())
    );
  }

  dashboard.managements.push({
    name: "students",
    entities: await db.collection("users").find({ role: "student" }).toArray(),
  });

  dashboard.managements.push({
    name: "teachers",
    entities: await db.collection("users").find({ role: "teacher" }).toArray(),
  });

  return dashboard;
}

console.log("getDashboard", getDashboard);
module.exports.getDashboard = getDashboard;
// if (require.main === module) {
//   const { connectDb } = require("../../config");
//   // Code to be executed if this script is the main entry point
//   (async () => {
//     await connectDb();
//     // await client.db("cathema").collection("users").insertOne({
//     //   login: "admin",
//     //   role: "admin"
//     // })
//     // console.log('admin created')
//     console.dir(await exports.getAdminDashboard("cathema"));
//   })();
//   console.log("This is the main script");
// }
