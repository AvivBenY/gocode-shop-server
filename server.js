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

app.get("/products", (req, res) => {
    fsp.readFile('./products.json', 'utf8').then(data => {
        const jsonData = JSON.parse(data);
        const stringData = JSON.stringify(jsonData);
        res.send(stringData);
    })
})

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

app.listen('8000');