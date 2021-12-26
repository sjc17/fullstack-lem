const { Router } = require('express');
const lemsRouter = Router();
const { makeQuery } = require('../../database/db');

// GET all LEMs for a specified purchase order
lemsRouter
  .get('/', async function (req, res, next) {
    const { purchaseOrderId } = req.query;
    const text = 'SELECT id, PurchaseOrderId, WorkDate, Location, Comments FROM LEMs WHERE PurchaseOrderId=COALESCE($1, PurchaseOrderId)';
    makeQuery(text, [purchaseOrderId], res, next);
  })
  // POST LEM
  .post('/', async function (req, res, next) {
    const { purchaseOrderId, workDate, location, comments } = req.body;
    console.log(purchaseOrderId);
    const text = 'INSERT INTO LEMs (PurchaseOrderId, WorkDate, Location, Comments) VALUES ((SELECT PurchaseOrders.id FROM PurchaseOrders WHERE PurchaseOrders.id=$1), $2, $3, $4) RETURNING id';
    makeQuery(text, [purchaseOrderId, workDate, location, comments], res, next);
  });

module.exports = lemsRouter;
