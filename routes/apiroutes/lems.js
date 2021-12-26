const { Router } = require('express');
const lemsRouter = Router();
const { makeQuery } = require('../../database/db');

// GET All LEMs or a specific one using the id
lemsRouter
  .get('/', async function (req, res, next) {
    const { LEMid } = req.query;
    const text = 'SELECT id, PurchaseOrderId, WorkDate, Location, Comments FROM LEMs WHERE id=COALESCE($1, id)';
    makeQuery(text, [LEMid], res, next);
  })
  // POST LEM
  .post('/', async function (req, res, next) {
    const { purchaseOrderId, workDate, location, comments } = req.body;
    const text = 'INSERT INTO LEMs (PurchaseOrderId, WorkDate, Location, Comments) VALUES ((SELECT id FROM PurchaseOrders WHERE id=$1), $2, $3, $4) RETURNING id';
    makeQuery(text, [purchaseOrderId, workDate, location, comments], res, next);
  });

module.exports = lemsRouter;
