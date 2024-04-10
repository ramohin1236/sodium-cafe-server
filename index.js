const express = require('express')
const app = express();
const cors =require('cors');
const port = process.env.PORT || 8000;
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
require('dotenv').config()
// middleware
app.use(cors());
app.use(express.json())



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

//   get cart data for single user
app.get('/carts',async(req,res)=>{
     const email = req.query.email;
     const filter = {email: email}
     const result = await cartCollections.find(filter).toArray();
     res.send(result)
})


// get specific cart

app.get('/carts/:id', async(req,res)=>{
    const id = req.params.id;
    const filter= {_id: new ObjectId(id)}
    const result = await cartCollections.findOne(filter)
    res.send(result)
})





// delete items from cart

app.delete('/carts/:id', async(req,res)=>{
    const id = req.params.id;
    const filter= {_id: new ObjectId(id)}
    const result = await cartCollections.deleteOne(filter)
    res.send(result)
})

// update cart quantity

app.put('/carts/:id', async(req,res)=>{
    const id = req.params.id;
    const {quantity}=req.body;
    const filter= {_id: new ObjectId(id)}
    const options = {upsert:true}

    const updateDoc={
        $set:{
            quantity:parseInt(quantity,10)
        }
    }
    const result = await cartCollections.updateOne(filter,updateDoc,options)
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