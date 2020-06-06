const express = require('express');
const router = express.Router();
const {renderMainPage, renderReal, renderConfig, renderMoni, renderSensores} = require('../controllers/controlador');

//Routes
router.get('/index',renderMainPage);

router.get('/sensores', renderSensores);

router.get('/tiemporeal', renderReal);

router.get('/moni', renderMoni);

router.get('/config', renderConfig);

module.exports = router;