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
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.PRIVATE_KEY_MU}:${process.env.PRIVATE_KEY_MP}@cluster0.dof2kcq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


//mongoDB async start
const run = async() =>{

    


}

run().catch(err =>console.log(err))


app.listen(port, () =>{
    console.log(`Daily server runnig on port ${port}`)
})