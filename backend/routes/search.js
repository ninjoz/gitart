const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const database = require('../database');
const axios = require('axios');
let bodyParser = require('body-parser')
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
function executeQuery(query, params) {
  return new Promise((resolve, reject) => {
    database.query(query, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}




router.get('/', (req, res) => {
  res.redirect('/home');
});





router.post('/', async (req, res) => {
  if (req.session.user_id) {
    try {
      let searchQuery = req.body.search_query || req.query.search_query;
      const userId = req.session.user_id;
      const start_index = req.query.start_index || req.body.start_index || 0;
      const num_record = req.query.num_record || req.body.num_record || 15;
      const sort_order = req.body.sort_order || req.query.sort_order || 'asc';

      if (userId) {
        // Insert search history 
        await executeQuery(
          'INSERT INTO SearchHistory (user_id, search_prompt, search_date) VALUES (?, ?, CURRENT_TIMESTAMP)',
          [userId, searchQuery]
        );
      }





      const categoryQuery = `
        SELECT design_id
        FROM categories
        WHERE tags LIKE ?
      `;
      const categorySearchTerm = `%${searchQuery}%`;
      const categoryResults = await executeQuery(categoryQuery, [categorySearchTerm]);

      console.log('Category Results:', categoryResults);
      const designIdsFromCategories = categoryResults.map(result => result.design_id);

      console.log('Design IDs from Categories:', designIdsFromCategories);

      // Search in designs table to get design IDs based on design_title
      const designTitleQuery = `
        SELECT design_id
        FROM designs
        WHERE design_title LIKE ?
      `;
      const designTitleSearchTerm = `%${searchQuery}%`;
      const designTitleResults = await executeQuery(designTitleQuery, [designTitleSearchTerm]);

      console.log('Design Title Results:', designTitleResults);
      const designIdsFromDesignTitle = designTitleResults.map(result => result.design_id);

      console.log('Design IDs from Design Title:', designIdsFromDesignTitle);

      // Combine design IDs from both categories and design_title
      const designIds = [...new Set([...designIdsFromCategories, ...designIdsFromDesignTitle])];

      console.log('Combined Design IDs:', designIds);

      if (designIds.length > 0) {

        const finalProductQuery = `
        SELECT 
        fp.fp_id, 
        fp.design_id, 
        fp.template_id, 
        fp.fp_price, 
        t.template_before, 
        t.template_after, 
        d.design_path,
        d.design_title,
        t.template_name
      FROM finalproduct fp
      LEFT JOIN templates t ON fp.template_id = t.template_id
      LEFT JOIN designs d ON fp.design_id = d.design_id
      WHERE fp.design_id IN (?)
      ORDER BY fp.fp_price ${sort_order === 'asc' ? 'ASC' : 'DESC'}  
      LIMIT ${start_index}, ${num_record}
        `;

        const queryParams = [designIds];

        console.log('Final Product Query:', finalProductQuery);

        const finalProductResults = await executeQuery(finalProductQuery, queryParams);

        console.log('Final Product Results:', finalProductResults);

        console.log(searchQuery)
        if (req.xhr) {
          // If it's an AJAX request and there are results, send only the product cards
          if (finalProductResults.length > 0) {
            res.render('partials/product-cards', {
              finalProductResults,
              start_index: start_index + num_record,
              num_record: num_record,
              searchQuery: searchQuery
            });
          } else {
            // If there are no results, send an empty response
            res.render({ finalProductResults: [], start_index: start_index });
          }
        } else {

          if (finalProductResults.length > 0) {
            res.render('search-results', {
              finalProductResults,
              start_index: start_index + num_record,
              num_record: num_record,
              searchQuery: searchQuery
            });
          } else {
            // If there are no results, render the page without results
            res.render('search-results', {
              finalProductResults: [],
              start_index: start_index,
              num_record: num_record,
              searchQuery: searchQuery
            });
          }
        }
      } else {
        // If there are no designIds, send an empty response
        res.json({ finalProductResults: [], start_index: start_index });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }


  }
  else {
    res.render('404');
  }

});





module.exports = router;


