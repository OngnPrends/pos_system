const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');

const app = express()
const database = require('../database')

router.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

router.get('/', async (req, res) => {
    try {
        const sales = await database.getSales();
        const products = await database.getProducts();
        let totalProfit = await database.getTotalProfitForToday(); // Fetch total profit for the day
        
        res.render("sales.ejs", {
            sales,
            products,
            totalProfit // Pass total profit to the template
        });
    } catch (error) {
        console.error("Error fetching sales:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/add', async (req, res) => {
    try {
        const products = await database.getProducts();
        res.render('addSale.ejs', { products });
    } catch (error) {
        console.error("Error fetching products for sale:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/add', async (req, res) => {
const { productId, quantity } = req.body;

    try {
        await database.recordSale(productId, quantity);
        console.log(`Sale recorded for product ID ${productId} with quantity ${quantity}`);
        res.redirect('/sales');
    } catch (error) {
        console.error("Error recording sale:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/:saleId/delete', async (req, res) => {
const saleId = req.params.saleId;

    try {
        await database.deleteSale(saleId);
        console.log(`Sale with ID ${saleId} deleted successfully`);
        res.redirect('/sales');
    } catch (error) {
        console.error("Error deleting sale:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/:saleId/edit', async (req, res) => {
const saleId = req.params.saleId;

    try {
        const sale = await database.getSaleById(saleId);
        res.render('editSale.ejs', { sale });
    } catch (error) {
        console.error("Error fetching sale details:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/:saleId/edit', async (req, res) => {
const saleId = req.params.saleId;
const { quantity_sold } = req.body; 

    try {
        const newData = { quantity_sold: parseInt(quantity_sold) }; 

        await database.editSale(saleId, newData);
        console.log(`Sale with ID ${saleId} updated successfully`);
        res.redirect('/sales');
    } catch (error) {
        console.error("Error updating sale:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
