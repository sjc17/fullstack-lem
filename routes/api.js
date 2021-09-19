var express = require('express');
var router = express.Router();
const pool = require('../database/db');
const createError = require('http-errors');

async function makeQuery(text, params, res, next) {
  try {
    const queryRes = await pool.query(text, params);
    res.send(queryRes.rows);
  } catch (err) {
    console.log(err);
    next(createError(500));
  }
}

// GET All Companies or specific Company
router.get('/companies', async function (req, res, next) {
  const { companyId } = req.query;
  const text = 'SELECT ID, Name FROM Companies WHERE id=COALESCE($1, id)';
  makeQuery(text, [companyId], res, next);
});

// POST Companies
router.post('/companies', async function (req, res, next) {
  const { companyName } = req.body;
  const text = 'INSERT INTO Companies (Name) VALUES ($1) RETURNING id';
  makeQuery(text, [companyName], res, next);
});

// GET Purchase Order details
router.get('/purchaseorders', async function (req, res, next) {
  const { purchaseOrderId, companyId } = req.query;
  const text =
    'SELECT C.Name As "Company Name", PO.Name As "PO Name", PO.Number As "PO Number", PO.Value As "Value" \
   FROM PurchaseOrders As PO INNER JOIN Companies As C ON PO.CompanyId=C.id \
   WHERE PO.CompanyId=COALESCE($1, PO.CompanyId) AND PO.id=COALESCE($2, PO.id)';
  makeQuery(text, [companyId, purchaseOrderId], res, next);
});

// POST Purchase Order
router.post('/purchaseorders', async function (req, res, next) {
  const { number, name, value, companyId } = req.body;
  console.log(req.body);
  const text =
    'INSERT INTO PurchaseOrders (Number, Name, Value, CompanyId) VALUES ($1, $2, $3, $4) RETURNING id';
  makeQuery(text, [number, name, value, companyId], res, next);
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
