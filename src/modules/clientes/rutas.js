const express = require('express');

const respuestas = require('../../Red/Respuestas');

const router = express.Router();

router.get('/', function(req, res){
    respuestas.success(req, res, 'Todo OK desde clientes', 200)
});

module.exports = router;