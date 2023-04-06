const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const { query } = require("express");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://huckleberrybd:huckleberrybd@cluster0.6crvlzi.mongodb.net/?retryWrites=true&w=majority";
// const uri = "mongodb://0.0.0.0:27017";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const orderCollection = client.db("huckleberrybd").collection("order");

async function run() {
  // order post
  try {
    app.post("/addorder", async (req, res) => {
      const result = await orderCollection.insertOne(req.body);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
  try {
    app.get("/allorder", async (req, res) => {
      const result = await orderCollection.find({}).toArray();
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }

  // get proccesing Order

  try {
    app.get("/", async (req, res) => {
      res.send("server running on 5000");
    });
  } catch (error) {
    console.log(error);
  }

  // update order state

  try {
    app.put("/updateorderstate", async (req, res) => {
      const data = req.body;
      const id = data.orderId;
      const orderState = data.orderstate;
      const result = await orderCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: orderState } },
        { upsert: true }
      );

      res.send(result);
    });
  } catch (error) {
    res.send(error);
  }

  // get processing order
  try {
    app.get("/processing", async (req, res) => {
      const result = await orderCollection
        .find({ status: "processing" })
        .toArray();
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }

  // get on hold order
  try {
    app.get("/onhold", async (req, res) => {
      const result = await orderCollection.find({ status: "onhold" }).toArray();
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }

  // get complete order
  try {
    app.get("/complete", async (req, res) => {
      const result = await orderCollection
        .find({ status: "complete" })
        .toArray();
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
}
run().catch((error) => res.send(error));

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
