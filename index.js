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
    const usersCollection = db.collection("users");

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
      const blog = blogDB.find({status: 'approved'});
      const blogs = await blog.toArray();
      res.send(blogs);
    });

    // GET API For Finding Blog
    app.get("/pendingBlogs", async (req, res) => {
      const blog = blogDB.find({status: 'pending'});
      const blogs = await blog.toArray();
      res.send(blogs);
    });

    // GET API For Finding Blog
    app.put("/updateBlog/:id", async (req, res) => {
      const id = req.params.id
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateData = {
        $set: {
          status: 'approved'
        },
      };
      const result = await blogDB.updateOne(filter, updateData, options);
      res.json(result);
    });

    // DELETE BLOG
    app.delete("/blog/delete/:id", async (req, res) => {
      const id = req.params.id
      const filter = { _id: ObjectId(id) };
      const result = await blogDB.deleteOne(filter);
      res.json(result);
    });

    // GET API For Finding Category
    app.get("/category", async (req, res) => {
      const category = categoryDB.find({});
      const categories = await category.toArray();
      res.send(categories);
    });

    // GET API For Finding Single Blog
    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await blogDB.findOne(query);
      res.send(result);
    });

    // GET API For Finding Single Category
    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await categoryDB.findOne(query);
      res.send(result);
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

    // UPDATE - PUT API Category
    app.put("/category/:id", async (req, res) => {
      const id = req.params.id;
      const updatedCat = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateCat = {
        $set: {
          Title: updatedCat.Title,
          Banner: updatedCat.Banner,
        },
      };
      const result = await categoryDB.updateOne(filter, updateCat, options);
      res.json(result);
    });

    // DELETE API For Blog
    app.delete("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await blogDB.deleteOne(query);
      res.json(result);
    });

    // DELETE API For Category
    app.delete("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await categoryDB.deleteOne(query);
      res.json(result);
    });

    // USER SECTION

    // Get All User
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });
    // PUT Users
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    // Get User Email
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });
    // PUT Admin Email
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
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
