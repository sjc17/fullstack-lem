const { Router } = require('express');
const lemRowsRouter = Router();
const { makeQuery } = require('../../database/db');

// GET All LEM Rows or a specific one using the id
lemRowsRouter
  .get('/', async function (req, res, next) {
    const { LEMid } = req.query;
    const text = 'SELECT id, LEMid, ItemCode, WorkOrder, Quantity FROM LEMRows WHERE LEMid=COALESCE($1, LEMid)';
    makeQuery(text, [LEMid], res, next);
  })
  // POST LEM Row
  .post('/', async function (req, res, next) {
    const { LEMid, itemCode, workOrder, quantity } = req.body;
    const text = 'INSERT INTO LEMRows (LEMid, ItemCode, WorkOrder, Quantity) VALUES ((SELECT id FROM LEMs WHERE id=$1), $2, $3, $4) RETURNING id';
    makeQuery(text, [LEMid, itemCode, workOrder, quantity], res, next);
  });

module.exports = lemRowsRouter;
