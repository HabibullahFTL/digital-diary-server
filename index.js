const port = 4000;
const express = require('express');
var cors = require('cors');
const moment = require('moment');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const app = express();
const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.ummk1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Present Date & Time
const now = moment().format("YYYY-MM-DD HH:mm:ss");





client.connect(err => {
    const blogCollection = client.db(process.env.DB_NAME).collection("blogs");
    const adminCollection = client.db(process.env.DB_NAME).collection("admins");
    // perform actions on the collection object
    if (err) {
        console.log("There is an error");
    } else {
        app.get('/', (req, res) => {
            res.send({ message: "Welcome to digital dairy API system" });
        })


        // ============ [ For Creating new blog ]==============
        app.post('/write-blog', (req, res) => {
            const blog = req.body;
            blog.createdAt = now;
            blogCollection.insertOne(blog).then(result => {
                if (result.insertedCount > 0) {
                    res.send(result.ops[0])
                } else {
                    res.send({ message: "Something went wrong" })
                }
            })
        })

        // ============ [ For Showing all the blogs ]==============
        app.get('/all-blogs', (req, res) => {
            blogCollection.find({})
                .sort({ _id: -1 })
                .toArray((err, documents) => {
                    res.send(documents)
                })
        })


        // ============ [ For Adding New Admin ]==============
        app.post('/add-admin', (req, res) => {
            const admin = req.body;
            admin.createdAt = now;
            adminCollection.insertOne(admin).then(result => {
                if (result.insertedCount > 0) {
                    res.send(result.ops[0])
                } else {
                    res.send({ message: "Something went wrong" })
                }
            })
        })

        // ============ [ For Showing all Admins ]==============
        app.get('/all-admins', (req, res) => {
            adminCollection.find({})
                .sort({ _id: -1 })
                .toArray((err, documents) => {
                    res.send(documents)
                })
        })
    }
});


app.listen(process.env.PORT || port, () => console.log("Listening port 4000"))