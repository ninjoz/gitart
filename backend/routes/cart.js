const express = require('express');
const router = express.Router();
const database = require('../database');

router.get('/cart', (req, res) => {
    if (req.session.user_id) {
        const userId = req.session.user_id;

        const query = `
            SELECT
                CartItem.user_id,
                CartItem.fp_id,
                CartItem.fp_adding_date,
                CartItem.quantity,
                Designs.design_path,
                Designs.design_title,
                Templates.template_name,
                Templates.template_before,
                Templates.template_after,
                FinalProduct.fp_price
            FROM CartItem
            LEFT JOIN FinalProduct ON CartItem.fp_id = FinalProduct.fp_id
            INNER JOIN Templates ON FinalProduct.template_id = Templates.template_id
            INNER JOIN Designs ON FinalProduct.design_id = Designs.design_id
            WHERE CartItem.user_id = ?;
        `;

        database.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching cart data:', err);
                return res.status(500).send('Internal Server Error');
            }

            // Check if results is an array and has at least one item
            if (!Array.isArray(results) || results.length === 0) {
                return res.render('cart', { cartItems: [], cartTotal: 0 });
            }

            // Organize the data into a format suitable for rendering in the template
            const cartItems = results.map((row) => ({
                fp_id: row.fp_id,
                fp_adding_date: row.fp_adding_date,
                design_title: row.design_title,
                design_path: row.design_path,
                template_name: row.template_name,
                template_before: row.template_before,
                template_after: row.template_after,
                fp_price: row.fp_price,
                quantity: row.quantity,
            }));

            const cartTotal = cartItems.reduce((total, item) => total + item.fp_price * item.quantity, 0);

            res.render('cart', { cartItems, cartTotal });
        });

    }
    else {
        res.render('404');
    }

});

router.post('/removeItem', (req, res) => {
    if (req.session.user_id) {
        const userId = req.session.user_id;
        const { fpId } = req.body;

        // Retrieve the price of the item being removed by joining with FinalProduct table
        const getPriceQuery = 'SELECT FinalProduct.fp_price FROM CartItem ' +
            'INNER JOIN FinalProduct ON CartItem.fp_id = FinalProduct.fp_id ' +
            'WHERE CartItem.user_id = ? AND CartItem.fp_id = ?';

        database.query(getPriceQuery, [userId, fpId], (err, result) => {
            if (err) {
                console.error('Error getting item price:', err);
                return res.json({ success: false });
            }

            const removedItemPrice = result[0].fp_price;

            // Remove item from the CartItem table for the logged-in user
            const deleteQuery = 'DELETE FROM CartItem WHERE user_id = ? AND fp_id = ?';
            database.query(deleteQuery, [userId, fpId], (err) => {
                if (err) {
                    console.error('Error removing item:', err);
                    return res.json({ success: false });
                }
                return res.json({ success: true, removedItemPrice: removedItemPrice });
            });
        });
    }
    else {
        res.render('404');
    }

});


module.exports = router;
