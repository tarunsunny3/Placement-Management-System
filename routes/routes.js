const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
// const User = require('../db/userschema');
// const { requireAuth } = require('../middlewares/authToken');

router.get('/', (req, res)=>{
    res.send("Hi, it works");
})
router.post('/register', (req, res)=>{
  const {} = req.body;
})
module.exports = router;
