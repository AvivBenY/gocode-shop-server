import fsp from 'fs/promises'
import express from 'express'
import mongoose from 'mongoose'

const app = express();
app.use(express.json());


const db = mongoose.model(
    "Product", {
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
}
)

// //GET - QUERY
// app.get('/products', (req, res) => {
//     const { title } = req.query;
//     if (title) {
//         db.find().then((data) => {
//             const filterProducts = data.filter((p) =>
//                 p.title.toLowerCase().includes(title.toLowerCase()))
//             res.send(filterProducts);
//         }).catch((e) => console.log("error", e))
//     } else { res.send(db.find()) }
// })

//GET ALL PRODUCTS
app.get('/products', (req, res) => {
    db.find().then((data) => res.send(data)).catch((e) => console.log("error", e));
})

// //GET PRODUCT BY ID
app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    if (id) {
        db.findById(id).then((product) => {
            res.send(product);
        }).catch((e) => console.log("error", e));
    }
})

// //CREATE
app.post('/products', (req, res) => {
    const { title } = req.body;
    const { price } = req.body;
    const { description } = req.body;
    const { category } = req.body;
    const { image } = req.body;
    db.insertMany([{
        title,
        price,
        description,
        category,
        image
    }]).then((data) => res.send(data))
})


// //DELETE BY ID
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    if (id) {
        db.findByIdAndRemove(id).then((data) => {
            res.send(data);
        }).catch((e) => console.log("error", e))
    }
})

//UPDATE
app.patch('/products/:id', (req, res) => {
    const { id } = req.params;
    console.log("id", id);
    console.log("body", req.body);
    if (id) {
        db.findByIdAndUpdate(id, req.body).then((p) => {
            console.log("P:", p);
            res.send(p);
        }).catch((e) => console.log("error", e))
    }
})


mongoose.connect('mongodb://localhost:27017/gocode-shop').then(() => {
    console.log("db connected");
    app.listen(8000);
})