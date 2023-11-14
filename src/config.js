const path = require("path");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion } = require("mongodb");

dotenv.config();
dotenv.config({
  path: path.resolve(__dirname, "..", ".env.test"),
});

exports.env = process.env;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

exports.connectDb = async function connectDb() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    process.dbClient = client;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};

if (require.main === module) {
  // Code to be executed if this script is the main entry point
  (async () => {
    // await client.connect();
    // await client.db("cathema").collection("users").insertOne({
    //   login: "admin",
    //   role: "admin"
    // })
    // console.log('admin created')
  })()
  console.log("This is the main script");
}
