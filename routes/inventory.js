const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');

const app = express()
const database = require('../database')

router.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

router.post('/:productId/delete', async (req, res) => {
    const productId = req.params.productId;
    console.log(productId)
  
    try {
        await database.deleteProduct(productId);
        console.log(`Product with ID ${productId} deleted successfully`);

        res.redirect('/inventory');
    } catch (error) {
        console.error("Error deleting inventory:", error);
        res.status(500).send("Internal Server Error");
    }
});
  
router.get('/', async (req, res) => {
    try {
        const inventory = await database.getProducts();
        const productsWithStatus = await database.getStatus();

        res.render("inventory.ejs", {
        inventory: productsWithStatus
        });
    } catch (error) {
        console.error("Error fetching inventory:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/:productId/increase', async (req, res) => {
const productId = req.params.productId;
console.log(productId)

    try {
        await database.increaseStock(productId);
        console.log(`Product with ID ${productId} increased successfully`);
        res.redirect('/inventory');
    } catch (error) {
        console.error("Error increasing inventory:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/:productId/decrease', async (req, res) => {
    const productId = req.params.productId;
    console.log(productId)

    try {
        await database.decreaseStock(productId)
        console.log(`Product with ID ${productId} decreased successfully`);
        res.redirect('/inventory');
    } catch (error) {
        console.error("Error decrease inventory:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
