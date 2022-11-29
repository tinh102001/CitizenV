const express = require('express');
const router = express.Router();

const search_controller = require('../app/controllers/search.controller');
const K = require('../app/controllers/role.controller');

router.use('/search',K.checkTicket,K.isA123B1,search_controller.searching);
router.use('/',search_controller.index);

module.exports = router;