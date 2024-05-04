const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');

const app = express()
const database = require('../database')

router.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

router.get('/', async (req, res) => {
    try {
      const products = await database.getProducts();
  
      res.render("products.ejs", {
        products
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send("Internal Server Error");
    }
  });

router.get('/add', (req, res) => {
    res.render('AddProduct.ejs'); 
});

router.post('/add', async (req, res) => {
  const { name, description, price, category, quantity } = req.body; 

  try {
      const productId = await database.addProduct(name, description, price, category, quantity);
      console.log(`Product added with ID: ${productId}`);

      res.redirect('/products');
  } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).send("Internal Server Error");
  }
});

router.post('/:productId/delete', async (req, res) => {
  const productId = req.params.productId;
  console.log(productId)

  try {
      await database.deleteProduct(productId);
      console.log(`Product with ID ${productId} deleted successfully`);

      res.redirect('/products');
  } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).send("Internal Server Error");
  }
});

router.get('/:productId/edit', async (req, res) => {
  const productId = req.params.productId;

  try {
      const product = await database.getProductById(productId);

      res.render('editProduct.ejs', { product });
  } catch (error) {
      console.error("Error fetching product details:", error);
      res.status(500).send("Internal Server Error");
  }
});

router.post('/:productId/edit', async (req, res) => {
  const productId = req.params.productId;
  const newData = req.body; 

  try {
      await database.editProduct(productId, newData);
      console.log(`Product with ID ${productId} edit successfully`);

      res.redirect('/products');
  } catch (error) {
      console.error("Error editing product:", error);
      res.status(500).send("Internal Server Error");
  }
});

module.exports = router;