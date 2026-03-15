import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://RupamGanguly46:123@cluster0.bydoapt.mongodb.net/?appName=Cluster0&retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    console.log("Connecting using native MongoDB driver...");
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    await client.close();
  }
}
run();
