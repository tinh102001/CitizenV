const express = require('express');
const router = express.Router();

const sign_controller = require('../app/controllers/sign.controller');

router.get('/', sign_controller.index); 
router.post('/', sign_controller.login); 
// router.get('/dangky', sign_controller.dangky);
// router.post('/dangky', sign_controller.p_dangky);



module.exports = router;