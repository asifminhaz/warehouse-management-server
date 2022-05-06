const express = require('express')
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
 const res = require('express/lib/response');
const app = express()
const port = process.env.PORT || 5000;

//middleware//
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fnywz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log( process.env.DB_USER, process.env.DB_PASS)

async function run (){
          try{
              await client.connect();
              const inventoriesCollection = client.db('motoDeal').collection('inventories');
              app.get('/inventories', async (req, res)=> {
                    const query = {};
                    const cursor = inventoriesCollection.find(query);
                    const allInventories = await cursor.toArray();
                    res.send(allInventories);
              })

              app.get('/inventories/:id', async (req, res)=> {
                        const id = req.params.id;
                        const query = {_id: ObjectId(id) }
                        const inventories = await inventoriesCollection.findOne(query)
                        res.send(inventories)
              })
          }
          finally{

          }
}
run().catch(console.dir)
app.get('/', (req, res)=> {
          res.send('running the servers')
});

app.listen(port, () => {
          console.log('listening to port', port)
})