var express = require('express');
var router = express.Router();
const { resetDb } = require('../database/db');
const createError = require('http-errors');

const companiesRouter = require('../routes/apiroutes/companies');
const purchaseOrdersRouter = require('../routes/apiroutes/purchaseOrders');
const lemItemsRouter = require('../routes/apiroutes/lemItems');
const lemRowsRouter = require('../routes/apiroutes/lemRows');
const lemsRouter = require('../routes/apiroutes/lems');

router.use('/companies', companiesRouter);
router.use('/purchaseOrders', purchaseOrdersRouter);
router.use('/lemItems', lemItemsRouter);
router.use('/lemRows', lemRowsRouter);
router.use('/lems', lemsRouter);

router.post('/reset', async function (req, res, next) {
  res.send(await resetDb());
});

module.exports = router;
