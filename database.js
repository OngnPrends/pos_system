const mysql = require('mysql2')
const pool = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'pos_db'
})

async function getProducts() {
  try {
    const [rows] = await pool.promise().query("SELECT * FROM products;");
    return rows;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function addProduct(name, description, price, category, quantity) {
  try {
    const query = "INSERT INTO products (name, description, price, category, quantity) VALUES (?, ?, ?, ?, ?)";
    const [result] = await pool.promise().execute(query, [name, description, price, category, quantity]);
    return result.insertId; 
  } catch (error) {
    console.error("Error adding product:", error);
    throw error; 
  }
}

async function deleteProduct(productId) {
  try {
    const query = "DELETE FROM products WHERE product_id = ?";
    const [result] = await pool.promise().execute(query, [productId]);
    if (result.affectedRows === 0) {
      throw new Error(`Product with ID ${productId} not found`);
    }
    console.log(`Product with ID ${productId} deleted successfully`);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error; 
  }
}

async function getProductById(productId) {
  try {
    const query = "SELECT * FROM products WHERE product_id = ?";
    const [result] = await pool.promise().execute(query, [productId]);
    if (result.length === 0) {
      throw new Error(`Product with ID ${productId} not found`);
    }
    return result[0]; 
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error; 
  }
}

async function editProduct(productId, newData) {
  try {
    if (!newData) {
      throw new Error("New data for product update is missing");
    }

    const { name, description, price, category, quantity } = newData;

    const updatedName = name || "";
    const updatedDescription = description || "";
    const updatedPrice = price || 0;
    const updatedCategory = category || "";
    const updatedQuantity = quantity || 0;

    const query = "UPDATE products SET name = ?, description = ?, price = ?, category = ?, quantity = ? WHERE product_id = ?";
    const [result] = await pool.promise().execute(query, [updatedName, updatedDescription, updatedPrice, updatedCategory, updatedQuantity, productId]);
    if (result.affectedRows === 0) {
      throw new Error(`Product with ID ${productId} not found`);
    }
    console.log(`Product with ID ${productId} edited successfully`);
  } catch (error) {
    console.error("Error editing product:", error);
    throw error; 
  }
}

async function getStatus() {
  try {
    const [rows] = await pool.promise().query("SELECT * FROM products");
    const productsWithStatus = rows.map(product => {
      const status = product.quantity <= 100 ? "Low stock" : "High stock";
      return { ...product, status };
    });
    return productsWithStatus;
  } catch (error) {
    console.error("Error fetching stock status:", error);
    throw error;
  }
}

async function increaseStock(productId) {
  try {
    const query = "UPDATE products SET quantity = quantity + 1 WHERE product_id = ?;";
    const [result] = await pool.promise().execute(query, [productId]);
    if (result.affectedRows === 0) {
      throw new Error(`Product with ID ${productId} not found`);
    }
    console.log(`Stock with ID ${productId} increased successfully`);
  } catch (error) {
    console.error("Error increasing product:", error);
    throw error; 
  }
}

async function decreaseStock(productId) {
  try {
    const query = "UPDATE products SET quantity = quantity - 1 WHERE product_id = ?;";
    const [result] = await pool.promise().execute(query, [productId]);
    if (result.affectedRows === 0) {
      throw new Error(`Product with ID ${productId} not found`);
    }
    console.log(`Stock with ID ${productId} decreased successfully`);
  } catch (error) {
    console.error("Error decreasing product:", error);
    throw error; 
  }
}

async function getSales() {
  try {
    const query = `
      SELECT sales.*, products.name AS product_name
      FROM sales
      INNER JOIN products ON sales.product_id = products.product_id;
    `;
    const [rows] = await pool.promise().query(query);
    return rows;
  } catch (error) {
    console.error("Error fetching sales:", error);
    return [];
  }
}

async function recordSale(productId, quantity) {
  return new Promise((resolve, reject) => {
      pool.query('SELECT quantity FROM products WHERE product_id = ?', [productId], (error, results) => {
          if (error) {
              reject(error);
              return;
          }
          if (results.length === 0) {
              reject(new Error('Product not found'));
              return;
          }
          const availableQuantity = results[0].quantity;
          if (availableQuantity < quantity) {
              reject(new Error('Insufficient quantity available'));
              return;
          }

          pool.query('INSERT INTO sales (product_id, quantity_sold, sale_date) VALUES (?, ?, NOW())', [productId, quantity], (error, results) => {
              if (error) {
                  reject(error);
                  return;
              }
              const updatedQuantity = availableQuantity - quantity;
              pool.query('UPDATE products SET quantity = ? WHERE product_id = ?', [updatedQuantity, productId], (error, results) => {
                  if (error) {
                      reject(error);
                      return;
                  }
                  resolve();
              });
          });
      });
  });
}

// Delete a sale by saleId
async function deleteSale(saleId) {
  try {
      const query = "DELETE FROM sales WHERE sale_id = ?";
      const [result] = await pool.promise().execute(query, [saleId]);
      if (result.affectedRows === 0) {
          throw new Error(`Sale with ID ${saleId} not found`);
      }
      console.log(`Sale with ID ${saleId} deleted successfully`);
  } catch (error) {
      console.error("Error deleting sale:", error);
      throw error;
  }
}

// Fetch a sale by saleId
async function getSaleById(saleId) {
  try {
      const query = "SELECT * FROM sales WHERE sale_id = ?";
      const [result] = await pool.promise().execute(query, [saleId]);
      if (result.length === 0) {
          throw new Error(`Sale with ID ${saleId} not found`);
      }
      return result[0];
  } catch (error) {
      console.error("Error fetching sale:", error);
      throw error;
  }
}

// Update a sale by saleId with new data
async function editSale(saleId, newData) {
  try {
      // Assuming newData is an object containing fields to be updated
      const query = "UPDATE sales SET ? WHERE sale_id = ?";
      const [result] = await pool.promise().execute(query, [newData, saleId]);
      if (result.affectedRows === 0) {
          throw new Error(`Sale with ID ${saleId} not found`);
      }
      console.log(`Sale with ID ${saleId} updated successfully`);
  } catch (error) {
      console.error("Error updating sale:", error);
      throw error;
  }
}


module.exports = { 
  getProducts,
  addProduct, 
  deleteProduct,
  editProduct,
  getProductById,

  getStatus,
  increaseStock,
  decreaseStock,
  
  getSales, 
  recordSale,
  deleteSale,
  getSaleById,
  editSale
};