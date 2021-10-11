const { Router } = require('express');
const companiesRouter = Router();
const { makeQuery } = require('../../database/db');

// GET All Companies or specific Company
companiesRouter
  .get('/', async function (req, res, next) {
    const { companyId } = req.query;
    const text = 'SELECT ID, Name FROM Companies WHERE id=COALESCE($1, id)';
    makeQuery(text, [companyId], res, next);
  })
  // POST Companies
  .post('/', async function (req, res, next) {
    const { companyName } = req.body;
    const text = 'INSERT INTO Companies (Name) VALUES ($1) RETURNING id';
    makeQuery(text, [companyName], res, next);
  });


module.exports = companiesRouter;
