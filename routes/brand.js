var express = require('express');
var router = express.Router();
var upload = require('./multer');
var pool = require('./pool');

// Route to submit a new brand
router.post('/brand_submit', upload.single('brandicon'), function(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.', status: false });
        }

        pool.query(
            "INSERT INTO brand (brandname, brandicon, created_at, updated_at, categoryid, subcategoryid) VALUES (?, ?, ?, ?, ?, ?)", 
            [req.body.brandname, req.file.filename, req.body.created_at, req.body.updated_at, req.body.categoryid, req.body.subcategoryid], 
            function(error, result) {
                if (error) {
                    console.error("Database Error:", error);
                    return res.status(500).json({ message: 'Database Error, please contact the backend team...', status: false });
                }
                res.status(200).json({ message: 'Brand submitted successfully...', status: true });
            }
        );
    } catch (e) {
        console.error("Server Error:", e);
        res.status(500).json({ message: 'Severe error on server, please contact the backend team...', status: false });
    }
});

// Route to edit brand data
router.post('/edit_brand_data', function(req, res, next) {
    try {
        pool.query(
            "UPDATE brand SET brandname=?, updated_at=?, categoryid=?, subcategoryid=? WHERE brandid=?", 
            [req.body.brandname, req.body.updated_at, req.body.categoryid, req.body.subcategoryid, req.body.brandid], 
            function(error, result) {
                if (error) {
                    console.error("Database Error:", error);
                    return res.status(500).json({ message: 'Database Error, please contact the backend team...', status: false });
                }
                res.status(200).json({ message: 'Brand updated successfully...', status: true });
            }
        );
    } catch (e) {
        console.error("Server Error:", e);
        res.status(500).json({ message: 'Severe error on server, please contact the backend team...', status: false });
    }
});

// Route to edit brand icon
router.post('/edit_brand_icon', upload.single('brandicon'), function(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.', status: false });
        }

        pool.query(
            "UPDATE brand SET brandicon=?, updated_at=? WHERE brandid=?", 
            [req.file.filename, req.body.updated_at, req.body.brandid], 
            function(error, result) {
                if (error) {
                    console.error("Database Error:", error);
                    return res.status(500).json({ message: 'Database Error, please contact the backend team...', status: false });
                }
                res.status(200).json({ message: 'Brand icon updated successfully...', status: true });
            }
        );
    } catch (e) {
        console.error("Server Error:", e);
        res.status(500).json({ message: 'Severe error on server, please contact the backend team...', status: false });
    }
});

// Route to delete a brand
router.post('/delete_brand', function(req, res, next) {
    try {
        pool.query(
            "DELETE FROM brand WHERE brandid=?", 
            [req.body.brandid], 
            function(error, result) {
                if (error) {
                    console.error("Database Error:", error);
                    return res.status(500).json({ message: 'Database Error, please contact the backend team...', status: false });
                }
                res.status(200).json({ message: 'Brand deleted successfully...', status: true });
            }
        );
    } catch (e) {
        console.error("Server Error:", e);
        res.status(500).json({ message: 'Severe error on server, please contact the backend team...', status: false });
    }
});

// Route to display all brands
router.get('/display_all_brand', function(req, res, next) {
    try {
        pool.query(
            `SELECT B.*, 
                    (SELECT C.categoryname FROM category C WHERE C.categoryid = B.categoryid) AS categoryname,
                    (SELECT SC.subcategoryname FROM subcategory SC WHERE SC.subcategoryid = B.subcategoryid) AS subcategoryname
             FROM brand B`, 
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

// Route to get all brands by subcategory ID
router.get('/get_all_brand_by_subcategoryid', function(req, res, next) {
    try {
        pool.query(
            `SELECT B.*, 
                    (SELECT C.categoryname FROM category C WHERE C.categoryid = B.categoryid) AS categoryname,
                    (SELECT SC.subcategoryname FROM subcategory SC WHERE SC.subcategoryid = B.subcategoryid) AS subcategoryname
             FROM brand B 
             WHERE B.subcategoryid=?`, [req.body.subcategoryid], 
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
