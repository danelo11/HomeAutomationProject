const express = require('express');
const router = express.Router();
const {renderMainPage, 
    renderReal,
    renderConfig, 
    renderMoni, 
    renderSensores, 
    showMeasurements,
} = require('../controllers/controlador');
const {isAuthenticated} = require('../auxiliary/authenticated');

//Routes
router.get('/index', renderMainPage);

router.get('/sensores', renderSensores);

router.get('/tiemporeal', renderReal);

router.get('/moni', renderMoni);

router.get('/moni/filters', showMeasurements);

router.get('/config', renderConfig);

module.exports = router;