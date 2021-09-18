var express = require('express');
var router = express.Router();
const pool = require('../database/db');
const createError = require('http-errors');

async function makeQuery(text, params, res, next) {
  try {
    console.log(`Query Text: ${text}`);
    console.log(`Params: ${params}`);
    const queryRes = await pool.query(text, params);
    res.send(queryRes.rows);
  } catch (err) {
    console.log(err);
    next(createError(500));
  }
}

// GET All Companies or specific Company
router.get('/companies', async function (req, res, next) {
  const { companyId } = req.body;
  const text = 'SELECT ID, Name FROM Companies WHERE id=COALESCE($1, id)';
  makeQuery(text, [companyId], res, next);
});

// GET Purchase order details
router.get('/purchaseorders', async function (req, res, next) {
  const { companyId } = req.body;
  const text =
    'SELECT C.Name As "Company Name", PO.Name As "PO Name", PO.Number As "PO Number", PO.Value As "Value" \
   FROM PurchaseOrders As PO INNER JOIN Companies As C ON PO.CompanyId=C.id \
   WHERE PO.CompanyId=COALESCE($1, PO.CompanyId)';
  makeQuery(text, [companyId], res, next);
});

router.get('/lemitems', async function (req, res, next) {
  // const queryRes = await pool.query('SELECT * FROM LEMItems');
  // res.send(queryRes.rows);
  res.send({});
});

router.post('/reset', async function (req, res, next) {
  res.send(await resetDb());
});

module.exports = router;
