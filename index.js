const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
app.use(cors());
app.use(express.json());
require("dotenv").config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uana9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const db = client.db("TravelFast");
    const blogDB = db.collection("blogs");
    const categoryDB = db.collection("category");

    // POST API For Adding Blog
    app.post("/blogs", async (req, res) => {
      const newBlog = req.body;
      const result = await blogDB.insertOne(newBlog);
      res.json(result);
    });

    // POST API For Adding category
    app.post("/category", async (req, res) => {
      const newCategory = req.body;
      const result = await categoryDB.insertOne(newCategory);
      res.json(result);
    });

    // GET API For Finding Blog
    app.get("/blogs", async (req, res) => {
      const blog = blogDB.find({});
      const blogs = await blog.toArray();
      res.send(blogs);
    });

    // GET API For Finding Single Blog
    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await blogDB.findOne(query);
      res.send(result);
    });

    // GET API For Finding Category
    app.get("/category", async (req, res) => {
      const category = categoryDB.find({});
      const categories = await category.toArray();
      res.send(categories);
    });

    // UPDATE - PUT API Blog
    app.put("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const updatedBlog = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateBlog = {
        $set: {
          title: updatedBlog.title,
          img: updatedBlog.img,
          traveler: updatedBlog.traveler,
          description: updatedBlog.description,
          category: updatedBlog.category,
          cost: updatedBlog.cost,
          location: updatedBlog.location,
          date: updatedBlog.date,
          rating: updatedBlog.rating,
        },
      };
      const result = await blogDB.updateOne(filter, updateBlog, options);
      res.json(result);
    });

    // DELETE API For Blog
    app.delete("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await blogDB.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
