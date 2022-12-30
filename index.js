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
        const query = {email:email, isComplate: false};
        const result = await taskCollection.find(query).toArray();
        res.send(result)
    })

    app.get("/mycomplatetask", async(req, res) =>{
        const email = req.query.email;
        const filter = {email: email,  isComplate: true};
        const result = await taskCollection.find(filter).toArray();
        res.send(result)
    })

    //single task
    app.get("/updatetask/:id", async(req, res) =>{
        const result = await taskCollection.findOne({_id: ObjectId(req.params.id)});
        res.send(result)
    })

    //add new task
    app.post('/addtask', async (req, res) =>{
        const data = req.body;
        const result = await taskCollection.insertOne(data);
        res.send(result);
    });

    //add comment


    //delete task
    app.delete("/delete/:id", async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        console.log(query)
        const result = await taskCollection.deleteOne(query);
        res.send(result)
    });

    //Update Complate and incomplate
    app.patch("/complatetask/:id", async(req, res) =>{
        const id = req.params.id;
        const value = req.body.isComplate;
        const filter = {_id: ObjectId(id)};
        const updateDoc = {
            $set:{
                isComplate: value
            }
        }
        const result = await taskCollection.updateOne(filter, updateDoc);
        res.send(result)
    })

    //update Task
    app.patch("/updatetask/:id", async(req, res) =>{
        const id = req.params.id;
        const data = req.body.data;
        const filter = {_id: ObjectId(id)};
        const updateDoc = {
            $set:{
                title: data.title,
                description: data.description
            }
        }
        const result = await taskCollection.updateOne(filter, updateDoc)
        res.send(result)
    })


}

run().catch(err =>console.log(err))


app.listen(port, () =>{
    console.log(`Daily server runnig on port ${port}`)
})