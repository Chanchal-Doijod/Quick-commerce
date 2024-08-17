var express = require('express');
var router = express.Router();
var upload = require('./multer');
var pool = require('./pool');

// Route to submit a new subcategory
router.post('/subcategory_submit', upload.single('subcategoryicon'), function(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.', status: false });
        }

        pool.query(
            "INSERT INTO subcategory (subcategoryname, subcategoryicon, created_at, updated_at, categoryid) VALUES (?, ?, ?, ?, ?)", 
            [req.body.subcategoryname, req.file.filename, req.body.created_at, req.body.updated_at, req.body.categoryid], 
            function(error, result) {
                if (error) {
                    console.error("Database Error:", error);
                    return res.status(500).json({ message: 'Database Error, please contact the backend team...', status: false });
                }
                res.status(200).json({ message: 'Subcategory submitted successfully...', status: true });
            }
        );
    } catch (e) {
        console.error("Server Error:", e);
        res.status(500).json({ message: 'Severe error on server, please contact the backend team...', status: false });
    }
});

// Route to edit subcategory data
router.post('/edit_subcategory_data', function(req, res, next) {
    try {
        pool.query(
            "UPDATE subcategory SET subcategoryname=?, updated_at=?, categoryid=? WHERE subcategoryid=?", 
            [req.body.subcategoryname, req.body.updated_at, req.body.categoryid, req.body.subcategoryid], 
            function(error, result) {
                if (error) {
                    console.error("Database Error:", error);
                    return res.status(500).json({ message: 'Database Error, please contact the backend team...', status: false });
                }
                res.status(200).json({ message: 'Subcategory updated successfully...', status: true });
            }
        );
    } catch (e) {
        console.error("Server Error:", e);
        res.status(500).json({ message: 'Severe error on server, please contact the backend team...', status: false });
    }
});

// Route to edit subcategory icon
router.post('/edit_subcategory_icon', upload.single('subcategoryicon'), function(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.', status: false });
        }

        pool.query(
            "UPDATE subcategory SET subcategoryicon=?, updated_at=? WHERE subcategoryid=?", 
            [req.file.filename, req.body.updated_at, req.body.subcategoryid], 
            function(error, result) {
                if (error) {
                    console.error("Database Error:", error);
                    return res.status(500).json({ message: 'Database Error, please contact the backend team...', status: false });
                }
                res.status(200).json({ message: 'Subcategory icon updated successfully...', status: true });
            }
        );
    } catch (e) {
        console.error("Server Error:", e);
        res.status(500).json({ message: 'Severe error on server, please contact the backend team...', status: false });
    }
});

// Route to delete a subcategory
router.post('/delete_subcategory', function(req, res, next) {
    try {
        pool.query(
            "DELETE FROM subcategory WHERE subcategoryid=?", 
            [req.body.subcategoryid], 
            function(error, result) {
                if (error) {
                    console.error("Database Error:", error);
                    return res.status(500).json({ message: 'Database Error, please contact the backend team...', status: false });
                }
                res.status(200).json({ message: 'Subcategory deleted successfully...', status: true });
            }
        );
    } catch (e) {
        console.error("Server Error:", e);
        res.status(500).json({ message: 'Severe error on server, please contact the backend team...', status: false });
    }
});

// Route to display all subcategories
router.get('/display_all_subcategory', function(req, res, next) {
    try {
        pool.query(
            `SELECT SC.*, (SELECT C.categoryname FROM category C WHERE C.categoryid = SC.categoryid) AS categoryname 
             FROM subcategory SC`, 
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

router.get('/get_all_subcategory_by_categoryid', function(req, res, next) {
    try {
        pool.query(
            `SELECT SC.*, (SELECT C.categoryname FROM category C WHERE C.categoryid = SC.categoryid) AS categoryname 
             FROM subcategory SC where SC.categoryid=?`,[req.body.categoryid] ,
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
