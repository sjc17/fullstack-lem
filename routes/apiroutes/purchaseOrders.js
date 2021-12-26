const { Router } = require('express');
const purchaseOrdersRouter = Router();
const { makeQuery } = require('../../database/db');

// GET Purchase Order details
purchaseOrdersRouter
  .get('/', async function (req, res, next) {
    const { purchaseOrderId, companyId } = req.query;
    const text =
      'SELECT PO.id As "PO ID", C.Name As "Company Name", PO.Name As "PO Name", PO.Number As "PO Number", PO.Value As "Value" \
     FROM PurchaseOrders As PO INNER JOIN Companies As C ON PO.CompanyId=C.id \
     WHERE PO.CompanyId=COALESCE($1, PO.CompanyId) AND PO.id=COALESCE($2, PO.id)';
    makeQuery(text, [companyId, purchaseOrderId], res, next);
  })
  // POST Purchase Order
  .post('/', async function (req, res, next) {
    const { number, name, value, companyId } = req.body;
    console.log(req.body);
    const text =
      'INSERT INTO PurchaseOrders (Number, Name, Value, CompanyId) VALUES ($1, $2, $3, $4) RETURNING id';
    makeQuery(text, [number, name, value, companyId], res, next);
  });

module.exports = purchaseOrdersRouter;
