var express = require('express');
var router = express.Router();
const pool = require('../database/db');
const { query } = require('express-validator');

// GET All Companies or specific Company
router.get('/companies', async function (req, res, next) {
  const { companyId } = req.body;
  const queryRes = await pool.query(
    'SELECT ID, Name FROM Companies WHERE id=COALESCE($1, id)',
    [companyId]
  );
  res.send(queryRes.rows);
});

// GET Purchase order details
router.get('/purchaseorders', async function (req, res, next) {
  const { companyId } = req.body;
  //const text = 'SELECT * FROM PurchaseOrders INNER JOIN Companies ON PurchaseOrders.id=Companies.id WHERE ($1 IS NULL OR PurchaseOrders.id=$1) AND ($2 IS NULL OR Companies.id=$2)';

  const text =
    'SELECT C.Name As "Company Name", PO.Name As "PO Name", PO.Number As "PO Number", PO.Value As "Value" \
   FROM PurchaseOrders As PO INNER JOIN Companies As C ON PO.CompanyId=C.id WHERE PO.CompanyId=COALESCE($1, PO.CompanyId)';
  const queryRes = await pool.query(text, [companyId]);
  res.send(queryRes.rows);
});

router.get('/lemitems', async function (req, res, next) {
  const queryRes = await pool.query('SELECT * FROM LEMItems');
  res.send(queryRes.rows);
});

router.post('/reset', async function (req, res, next) {
  res.send(await resetDb());
});

module.exports = router;
