const express = require('express');
const router = express.Router();

const manage_controller = require('../app/controllers/manage.controller');
const K = require('../app/controllers/role.controller'); 

router.get('/getnameprepro',K.checkTicket,K.isA123B1,manage_controller.getNamePrePro);
router.post('/changepass',K.checkTicket,K.isA123B1,manage_controller.changePass);
router.get('/providepre',K.checkTicket,K.isA123B1,manage_controller.providePre);
router.get('/droppre',K.checkTicket,K.isA123B1,manage_controller.dropPre);
router.get('/updatepro',K.checkTicket,K.isA123B1,manage_controller.updateProgress);
router.get('/prenode',K.checkTicket,K.isA123B1,manage_controller.preNode);
router.use('/',manage_controller.index); 

module.exports = router;