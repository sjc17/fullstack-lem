var express = require('express');
var router = express.Router();
const { resetDb } = require('../database/db');
const createError = require('http-errors');

const companiesRouter = require('../routes/apiroutes/companies');
const purchaseOrdersRouter = require('../routes/apiroutes/purchaseOrders');
const lemItemsRouter = require('../routes/apiroutes/lemItems');

router.use('/companies', companiesRouter);
router.use('/purchaseOrders', purchaseOrdersRouter);
router.use('/lemItems', lemItemsRouter);

router.post('/reset', async function (req, res, next) {
  res.send(await resetDb());
});

module.exports = router;
