const { ObjectId } = require("mongodb");
const { env, connectDb } = require("../config");

(async () => {
  await connectDb();
  const db = (await process.dbClient.connect()).db("cathema");
  // console.log(await db.collection("users").updateMany({ role: undefined }, {
  //   $set: {
  //     subjects: ["student"]
  //   }
  // }))
  // const promises = [];
  const subjects = ``
    .trim()
    .split(/\r?\n/);
  const subjectIds = [];
  for (const subject of subjects) {
    subjectIds.push(String((await db
      .collection("subjects")
      .findOne({ name: subject }))._id));
  }

  console.log("subjectIds", subjectIds)

  const classes = ``
    .trim()
    .split(/\r?\n/);
  for (const _class of classes) {
    console.log(
      await db.collection("classes").updateMany(
        { name: _class },
        {
          $set: {
            subjectIds,
          },
        }
      )
    )
  }
  // console.log(await db.collection("subjects").find().toArray());
  console.log("Done");
  process.exit();
})();
