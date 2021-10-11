const { Router } = require('express');
const lemItemsRouter = Router();
const { makeQuery } = require('../../database/db');

// GET All LEM Items or a specific one using the item code
lemItemsRouter
  .get('/', async function (req, res, next) {
    const { itemCode } = req.query;
    const text = 'SELECT ItemCode, Unit, Rate, Description FROM LEMItems WHERE ItemCode=COALESCE($1, ItemCode)';
    makeQuery(text, [itemCode], res, next);
  })
  // POST LEM Items
  .post('/', async function (req, res, next) {
    const { itemCode, unit, rate, description } = req.body;
    const text = 'INSERT INTO LEMItems (ItemCode, Unit, Rate, Description) VALUES ($1, $2, $3, $4) RETURNING ItemCode';
    makeQuery(text, [itemCode, unit, rate, description], res, next);
  });

module.exports = lemItemsRouter;
