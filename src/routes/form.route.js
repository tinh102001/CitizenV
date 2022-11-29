const express = require('express');
const router = express.Router();

const form_controller = require('../app/controllers/form.controller');
const K = require('../app/controllers/role.controller'); 
router.get('/prenode', K.checkTicket,K.isB12, form_controller.preNode);
router.post('/form',K.checkTicket,K.isB12,form_controller.form);
router.get('/listmember',K.checkTicket,K.isB12, form_controller.listMember);
router.post('/newfamily',K.checkTicket,K.isB12,form_controller.newFamily)
router.use('/', form_controller.index); 

module.exports = router;