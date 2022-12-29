const express = require('express');
const cors = require('cors')
require('dotenv').config();
const app =express();
const port = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) =>{
    res.send("Daily task Server is running")
})



//mongoDB setup
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.PRIVATE_KEY_MU}:${process.env.PRIVATE_KEY_MP}@cluster0.dof2kcq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


//mongoDB async start
const run = async() =>{

    const taskCollection = client.db("Daily_Task").collection("All_Task");


    app.get("/mytask", async(req, res) =>{
        const email = req.query.email
        const query = {email:email};
        const result = await taskCollection.find(query).toArray();
        res.send(result)
    })

    app.post('/addtask', async (req, res) =>{
        const data = req.body;
        const result = await taskCollection.insertOne(data);
        res.send(result);
    });

    app.delete("/delete/:id", async(req, res) =>{
        const id = req.params.id;
        const query = {id: ObjectId(id)};
        const result = await taskCollection.deleteOne(query);
        res.send(result)
    });

    app.patch("/complatetask/:id", async(req, res) =>{
        const id = req.params.id;
        const filter = {id: ObjectId(id)};
        const option = {upsert: true};
        const updateDoc = {
            $set:{
                isComplate: true
            }
        }
        const result = await taskCollection.updateOne(filter, updateDoc, option);
        res.send(result)
    })


    app.patch("/canceltask/:id", async(req, res) =>{
        const id = req.params.id;
        const filter = {id: ObjectId(id)};
        const updateDoc = {
            $set:{
                isComplate: false
            }
        }
        const result = await taskCollection.updateOne(filter, updateDoc, option);
        res.send(result)
    })


}

run().catch(err =>console.log(err))


app.listen(port, () =>{
    console.log(`Daily server runnig on port ${port}`)
})