const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()

const app = express();
const port =process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2ztzd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);
// নাম ও পাসওয়ার্ড বসানোর পরে একবার চেক করে দরকার । 


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{
        await client.connect();
        const database = client.db('carMechanic')
        const servicesCollection = database.collection('services');

        // GET API 
        app.get('/services', async(req, res) =>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        });

        // GET Single Service
        app.get('/services/:id', async(req, res) =>{
            const id =req.params.id;
            console.log('getting specific service',  id);
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })
        // আমরা যখন বাটনে ক্লিক করে সিঙ্গেল সার্ভিস এর মধ্যে যাব, সেটার জন্য ...। 65.7 এর ৯ মিনিটের দিকে ভিডিও দেখা যেতে পারে ।  

        // POST API 
        app.post('/services', async (req,  res) =>{
            const service = req.body;
            console.log('hit the post api ', service);

            const result = await servicesCollection.insertOne(service); 
            console.log(result); 
            res.json(result)
        })

        //   DELETE API  
        app.delete('/services/:id', async (req, res) =>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
            

        })

        
    }
    finally{
        // await client.closer();
    }
}

run().catch(console.dir)


app.get('/', (req, res) =>{
    res.send('Running Genius Server')
})

app.get('/hello', (req, res) =>{
    res.send('hello update here')
})

app.listen(port,() =>{
    console.log('Runnig Genius Server on port', port);
})

/*
Heroku steps 

one time:
01. heroku account open
02. heroku software install

Every Project
01. git init 
02. .gitignore (node_module,  .env)
03. Push everything to git 
04. make sure you have this script: "start": "node index.js"
05. make sure: put process.env.PORT in front of your port number
06. heroku login
07. heroku create (only one time for a project)
08. command: git push heroku main

------
update:
01. save everything check locally 
02. git add, git commit -m" , git push
03. git push heroku main

*/
