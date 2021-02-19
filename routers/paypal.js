const express = require('express');
const router = express.Router();

const { paypalController } = require('../controllers')

router.get('/', (req, res) => res.render('index'))
router.post('/pay', paypalController.pay);
router.get('/success', paypalController.success);
router.get('/cancel', (req, res) => res.send('cancel'))

module.exports = router;



