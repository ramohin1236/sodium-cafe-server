const express = require('express')
const app = express();
const cors =require('cors');
const port = process.env.PORT || 8000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
// middleware
app.use(cors());
app.use(express.json())

// sodium-cafe
// c1Jikx9yy2K54j6Z


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vjcdyry.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   
    await client.connect();
   
// database and collectons
const menuCollections = client.db("sodium-cafe").collection("Menu")
const cartCollections = client.db("sodium-cafe").collection("CartItems")


// all menu items operations
app.get('/menu', async(req,res)=>{
   
    const result= await menuCollections.find().toArray()
   res.send(result)
})

// customer cart items
  app.post('/carts', async(req,res)=>{
     const cartItem = req.body;
     const result = await cartCollections.insertOne(cartItem)
     console.log(result);
     res.send(result)
  })



































    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})