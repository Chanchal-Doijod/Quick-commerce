var express = require('express');
var router = express.Router();
var upload = require('./multer');
var pool = require('./pool');

// Route to submit a new product
router.post('/product_submit', upload.single('productimage'), function(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.', status: false });
        }

        pool.query(
            "INSERT INTO product (productname, productdescription, productimage, created_at, updated_at, categoryid, brandid) VALUES (?, ?, ?, ?, ?, ?, ?)", 
            [req.body.productname, req.body.productdescription, req.file.filename, req.body.created_at, req.body.updated_at, req.body.categoryid, req.body.brandid], 
            function(error, result) {
                if (error) {
                    console.error("Database Error:", error);
                    return res.status(500).json({ message: 'Database Error, please contact the backend team...', status: false });
                }
                res.status(200).json({ message: 'Product submitted successfully...', status: true });
            }
        );
    } catch (e) {
        console.error("Server Error:", e);
        res.status(500).json({ message: 'Severe error on server, please contact the backend team...', status: false });
    }
});

// Route to edit product data
router.post('/edit_product_data', function(req, res, next) {
    try {
        pool.query(
            "UPDATE product SET productname=?, productdescription=?, updated_at=?, categoryid=?, brandid=? WHERE productid=?", 
            [req.body.productname, req.body.productdescription, req.body.updated_at, req.body.categoryid, req.body.brandid, req.body.productid], 
            function(error, result) {
                if (error) {
                    console.error("Database Error:", error);
                    return res.status(500).json({ message: 'Database Error, please contact the backend team...', status: false });
                }
                res.status(200).json({ message: 'Product updated successfully...', status: true });
            }
        );
    } catch (e) {
        console.error("Server Error:", e);
        res.status(500).json({ message: 'Severe error on server, please contact the backend team...', status: false });
    }
});

// Route to edit product image
router.post('/edit_product_image', upload.single('productimage'), function(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.', status: false });
        }

        pool.query(
            "UPDATE product SET productimage=?, updated_at=? WHERE productid=?", 
            [req.file.filename, req.body.updated_at, req.body.productid], 
            function(error, result) {
                if (error) {
                    console.error("Database Error:", error);
                    return res.status(500).json({ message: 'Database Error, please contact the backend team...', status: false });
                }
                res.status(200).json({ message: 'Product image updated successfully...', status: true });
            }
        );
    } catch (e) {
        console.error("Server Error:", e);
        res.status(500).json({ message: 'Severe error on server, please contact the backend team...', status: false });
    }
});

// Route to delete a product
router.post('/delete_product', function(req, res, next) {
    try {
        pool.query(
            "DELETE FROM product WHERE productid=?", 
            [req.body.productid], 
            function(error, result) {
                if (error) {
                    console.error("Database Error:", error);
                    return res.status(500).json({ message: 'Database Error, please contact the backend team...', status: false });
                }
                res.status(200).json({ message: 'Product deleted successfully...', status: true });
            }
        );
    } catch (e) {
        console.error("Server Error:", e);
        res.status(500).json({ message: 'Severe error on server, please contact the backend team...', status: false });
    }
});

// Route to display all products
router.get('/display_all_product', function(req, res, next) {
    try {
        pool.query(
            `SELECT P.*, 
                    (SELECT C.categoryname FROM category C WHERE C.categoryid = P.categoryid) AS categoryname,
                    (SELECT B.brandname FROM brand B WHERE B.brandid = P.brandid) AS brandname
             FROM product P`, 
            function(error, result) {
                if (error) {
                    console.error("Database Error:", error);
                    return res.status(500).json({ message: 'Database Error, please contact the backend team...', status: false });
                }
                res.status(200).json({ message: 'Success...', data: result, status: true });
            }
        );
    } catch (e) {
        console.error("Server Error:", e);
        res.status(500).json({ message: 'Severe error on server, please contact the backend team...', status: false });
    }
});

// Route to get all products by category ID
router.get('/get_all_product_by_categoryid', function(req, res, next) {
    try {
        pool.query(
            `SELECT P.*, 
                    (SELECT C.categoryname FROM category C WHERE C.categoryid = P.categoryid) AS categoryname,
                    (SELECT B.brandname FROM brand B WHERE B.brandid = P.brandid) AS brandname
             FROM product P 
             WHERE P.categoryid=?`, [req.body.categoryid], 
            function(error, result) {
                if (error) {
                    console.error("Database Error:", error);
                    return res.status(500).json({ message: 'Database Error, please contact the backend team...', status: false });
                }
                res.status(200).json({ message: 'Success...', data: result, status: true });
            }
        );
    } catch (e) {
        console.error("Server Error:", e);
        res.status(500).json({ message: 'Severe error on server, please contact the backend team...', status: false });
    }
});

module.exports = router;
