import fsp from 'fs/promises'
import express from 'express'

const app = express();

app.use(express.json());

function maxId(arr) {
    const ids = arr.map(object => {
        return object.id;
    });
    const max = Math.max(...ids);
    return max
}

//QUERY
app.get('/products', (req, res) => {
    fsp.readFile('./products.json', 'utf8').then((data) => {
        const jsonData = JSON.parse(data);
        console.log("query", req.query);
        if (req.query) {
            const { title } = req.query;
            const filterProducts = jsonData.filter((p) =>
                p.title.toLowerCase().includes(title.toLowerCase()))
            console.log(filterProducts);
            res.send(filterProducts);
        }
        res.send(jsonData)
    })
})


READ
app.get("/products", (req, res) => {
    fsp.readFile('./products.json', 'utf8').then(data => {
        const jsonData = JSON.parse(data);
        const stringData = JSON.stringify(jsonData);
        res.send(stringData);
    })
})

//READ BY ID
app.get('/products/:productId', (req, res) => {
    const { productId } = req.params;
    fsp.readFile('./products.json', 'utf8').then(data => {
        const jsonData = JSON.parse(data);
        const product = jsonData.find((p) => p.id === +productId)
        if (product) {
            res.send(product);
        } else {
            res.send("cant get product");
        }
    })
})


//CREATE
app.post('/products', (req, res) => {
    console.log("req.body", req.body);
    fsp.readFile('./products.json', 'utf8').then((data) => {
        const products = JSON.parse(data);
        const { title } = req.body.title;

        products.push({
            id: maxId(products) + 1,
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            category: req.body.category,
            image: req.body.image,
            rating: {
                rate: 3.9,
                count: 120

            }
        });
        fsp.writeFile('./products.json', JSON.stringify(products));
        console.log(req.body);
        res.send(products)
    }
    )
})

//UPDATE
app.patch('/products/:productId', (req, res) => {
    const { productId } = req.params;
    const { title } = req.body;
    fsp.readFile('./products.json', 'utf8').then((data) => {
        if (req.body) {
            const jsonData = JSON.parse(data);
            const index = jsonData.findIndex((p) => p.id === +productId);
            jsonData[index] = { ...jsonData[index], ...req.body };
            console.log("data[index]", jsonData[index]);
            fsp.writeFile('./products.json', JSON.stringify(jsonData)).then(() => res.send(jsonData))
        }
    }).catch((e) => console.log("error"))
})

//DELETE
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    fsp.readFile('./products.json', 'utf8').then((data) => {
        const jsonData = JSON.parse(data);
        const index = jsonData.findIndex((p) => p.id === +id);
        if (index >= 0) {
            jsonData.splice(index, 1);
            fsp.writeFile('./products.json', JSON.stringify(jsonData)).then(() => res.send(jsonData));
            res.send(jsonData);
        }
    }).catch((e) => console.log("ERRORRR", e))
})



app.listen('8000');