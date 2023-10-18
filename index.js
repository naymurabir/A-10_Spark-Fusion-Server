const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;



// Middleware
app.use(cors())
app.use(express.json())



// Database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cgjyfgp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const brandsCollection = client.db("brandsDB").collection('brands')

        const productsCollection = client.db('brandsDB').collection('products')

        // Server Side APIs
        //GET
        app.get('/brands', async (req, res) => {
            const cursor = brandsCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        //POST
        app.post('/brands', async (req, res) => {
            const newBrand = req.body
            const result = await brandsCollection.insertOne(newBrand)
            res.send(result)
        })

        //Client Side APIs
        //GET
        app.get('/products/:brand', async (req, res) => {
            const brand = req.params.brand;
            const filter = { brand_name: brand }
            const product = productsCollection.find(filter)
            const result = await product.toArray(product)
            res.send(result)
            console.log(filter, result);
        })

        //POST
        app.post('/products', async (req, res) => {
            const newProduct = req.body
            const result = await productsCollection.insertOne(newProduct)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("The Spark Fusion server is running..")
})


app.listen(port, () => {
    console.log(`The Spark Fusion is running on port: ${port}`);
})