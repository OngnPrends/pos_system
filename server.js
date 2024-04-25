const express = require('express')
const bodyParser = require('body-parser');

const app = express()
const database = require('./database')

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

// RENDER HOMEPAGE

app.get('/', (req,res) => {
    res.render("index.ejs")
})

// PRODUCTS METHODS

app.get('/products', async (req, res) => {
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

app.get('/products/add', (req, res) => {
    res.render('AddProduct.ejs'); 
});

app.post('/products/add', async (req, res) => {
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

app.post('/products/:productId/delete', async (req, res) => {
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

app.get('/products/:productId/edit', async (req, res) => {
  const productId = req.params.productId;

  try {
      const product = await database.getProductById(productId);

      res.render('editProduct.ejs', { product });
  } catch (error) {
      console.error("Error fetching product details:", error);
      res.status(500).send("Internal Server Error");
  }
});

app.post('/products/:productId/edit', async (req, res) => {
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

// INVENTORY METHODS

app.post('/inventory/:productId/delete', async (req, res) => {
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

  app.get('/inventory', async (req, res) => {
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

  app.post('/inventory/:productId/increase', async (req, res) => {
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

  app.post('/inventory/:productId/decrease', async (req, res) => {
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

// SALES METHODS

app.get('/sales', async (req, res) => {
  try {
    const sales = await database.getSales();

    res.render("sales.ejs", {
      sales
    });
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/recordSale', async (req, res) => {
  try {
      const products = await database.getProducts();
      res.render('recordSale.ejs', { products });
  } catch (error) {
      console.error("Error fetching products for sale:", error);
      res.status(500).send("Internal Server Error");
  }
});

app.post('/recordSale', async (req, res) => {
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

app.post('/sales/:saleId/delete', async (req, res) => {
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

// Edit a sale
app.get('/sales/:saleId/edit', async (req, res) => {
  const saleId = req.params.saleId;

  try {
      const sale = await database.getSaleById(saleId);
      // Render the editSale.ejs file with the sale data
      res.render('editSale.ejs', { sale });
  } catch (error) {
      console.error("Error fetching sale details:", error);
      res.status(500).send("Internal Server Error");
  }
});

// Update a sale
app.post('/sales/:saleId/edit', async (req, res) => {
  const saleId = req.params.saleId;
  const newData = req.body; // Assuming you're sending updated data in the request body

  try {
      await database.editSale(saleId, newData);
      console.log(`Sale with ID ${saleId} updated successfully`);
      res.redirect('/sales');
  } catch (error) {
      console.error("Error updating sale:", error);
      res.status(500).send("Internal Server Error");
  }
});

app.use(express.static("public"))

const port = 8080
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})