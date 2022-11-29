const express = require('express');
const router = express.Router();

const list_controller = require('../app/controllers/list.controller');
const K = require('../app/controllers/role.controller');

router.get('/edit',K.checkTicket,K.isA123B1, list_controller.edit); 
router.get('/createnew',K.checkTicket,K.isA123B1, list_controller.createNew);
router.get('/delete',K.checkTicket,K.isA123B1, list_controller.delete);
router.get('/listmember',K.checkTicket,K.isA123B1, list_controller.listMember);
router.get('/statistic',K.checkTicket,K.isA123B1, list_controller.statistic);
router.get('/prenode',K.checkTicket,K.isA123B1, list_controller.preNode);
router.get('/searchname',K.checkTicket, list_controller.searchName);
router.use('/', list_controller.index);

module.exports = router;