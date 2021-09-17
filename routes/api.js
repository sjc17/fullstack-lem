var express = require('express');
var router = express.Router();
const pool = require('../database/db');

router.get('/companies', async function (req, res, next) {
  const queryRes = await pool.query('SELECT * FROM Companies');
  res.send(queryRes.rows);
});
router.get('/purchaseorders', async function (req, res, next) {
  const queryRes = await pool.query('SELECT * FROM PurchaseOrders');
  res.send(queryRes.rows);
});
router.get('/lemitems', async function (req, res, next) {
  const queryRes = await pool.query('SELECT * FROM LEMItems');
  res.send(queryRes.rows);
});
router.post('/reset', async function(req, res, next) {
  res.send(await resetDb());
});


module.exports = router;
