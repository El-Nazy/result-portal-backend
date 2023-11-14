const { ObjectId } = require("mongodb");
const { env, connectDb } = require("../config");

// (async () => {
//   await connectDb();
//   const db = (await process.dbClient.connect()).db("cathema");
//   await Promise.all(
//     `Nursery 1
// Nursery 2
// Grade 2
// Pre Nursery
// Grade 1
// Grade 4
// Grade 5
// Grade 3`
//       .split(/\r?\n/)
//       .map(async (subject) => {
//         if (!(await db.collection("classes").findOne({ name: subject }))) {
//           await db.collection("classes").insertOne({ name: subject });
//           console.log(subject, "added");
//           return;
//         }
//         console.log(subject, "already exists");
//       })
//   );
//   console.log("Done");
//   process.exit();
// })();

async function addDocuments(
  documents = [],
  collection = "",
  uniqueField,
  idFields = [
    {
      input: {
        field: "class",
        inTargetAs: "name",
      },
      output: {
        field: "classId",
        inTargetAs: "_id",
      },
      collection: "classes",
    },
  ]
) {
  await connectDb();
  const db = (await process.dbClient.connect()).db("cathema");

  await Promise.all(
    documents.map(async (document) => {
      if (
        !(await db
          .collection(collection)
          .findOne({ [uniqueField]: document[uniqueField].trim() }))
      ) {
        if (idFields.length > 0 && document[idFields[0].input.field]) {
          for (const idField of idFields) {
            const refDoc = await db.collection(idField.collection).findOne({
              [idField.input.inTargetAs]: document[idField.input.field],
            });
            delete document[idField.input.field];
            if (refDoc[idField.output.inTargetAs] instanceof ObjectId) {
              console.log("type was object id");
              document[idField.output.field] = String(
                refDoc[idField.output.inTargetAs]
              );
            } else {
              console.log("type was", typeof refDoc[idField.output.inTargetAs]);
              document[idField.output.field] =
                refDoc[idField.output.inTargetAs];
            }
          }
        }
        await db.collection(collection).insertOne(document);
        console.log("\nadded", document);
        return;
      }
      console.log(
        "document with",
        uniqueField,
        document[uniqueField],
        "already exists"
      );
    })
  );

  console.log("Done");
  process.exit();
}

addDocuments(
  prepareDocuments(
    `Nursery 1	Patience	Patience	teacher
Nursery 2	Nonye	Nonye	teacher
Grade 2	Ruth	Ruth	teacher
Pre Nursery	Kimen	Kimen	teacher
Grade 1	Jessica	Jessica	teacher
Grade 4	Mauren	Mauren	teacher
Grade 5	Uche	Uche	teacher
Grade 3	Joy	Joy	teacher
`,
    ["class", "name", "login", "role"]
  ),
  "users",
  "name",
  [
    {
      collection: "classes",
      input: {
        field: "class",
        inTargetAs: "name",
      },
      output: {
        field: "classId",
        inTargetAs: "_id",
      },
    },
  ]
);

function prepareDocuments(string = "", columns = []) {
  console.log("started", string, columns);
  const result = [];
  const lines = string.trim().split(/\r?\n/);
  for (line of lines) {
    console.log(line);
    console.log(line.split("\t").length);
    if (line === "") break;
    const doc = {};
    const rowCells = line.split(/\t/);
    for (i = 0; i < rowCells.length || i < columns.length; i++) {
      doc[columns[i]] = rowCells[i].trim();
      console.log(doc, rowCells[i], columns[i]);
    }
    result.push(doc);
  }
  return result;
}

// console.log(
//   prepareDocuments(
//     `Hart Dagogo	Grade 1	CMA/22/07
// James Zion	Grade 1	CMA/22/57
// `,
//     ["name", "class", "login"]
//   )
// );
