const express = require('express')
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;

//middleware//
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fnywz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
          try{
              await client.connect();
              const inventoriesCollection = client.db('motoDeal').collection('inventories');
              app.get('/inventories', async (req, res)=> {
                    const query = {};
                    const cursor = inventoriesCollection.find(query);
                    const allInventories = await cursor.toArray();
                    res.send(allInventories);
                    console.log('db connected')
              })

              app.get('/inventories/:id', async (req, res)=> {
                        const id = req.params.id;
                        const query = {_id: ObjectId(id) }
                        const inventories = await inventoriesCollection.findOne(query)
                        res.send(inventories)
              })

            //   delete inventories

            app.delete('/inventories/:id', async (req, res) => {
                const id = req.params.id;
                const query = {_id: ObjectId(id)}
                const result = await inventoriesCollection.deleteOne(query)
                res.send(result)
            })

            // update Quantity to increase
    app.put('/inventories/:id', async (req, res) => {
        const id = req.params
        const body = req.body
        const filter = {_id: ObjectId(id) }
        const options = { upsert: true };
        const update = {
          $set: {
            qauantity: body.newQuantity
  
          }
        }
        const result = await inventoriesCollection.updateOne(filter, update, options);
        res.send({ success: 'Your Deliver was SuccessFul' })
      })
    // update Quentity to decrease
    app.put('/inventory/:id', async (req, res) => {
        const id = req.params
       
        const body = req.body
       
        const filter = {_id: ObjectId(id) }
        const options = { upsert: true };
        const update = {
          $set: {
            qauantity: body.newQuantity
  
          }
        }
        const result = await inventoriesCollection.updateOne(filter, update, options);
        res.send({ success: 'Your added  SuccessFully' })
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


