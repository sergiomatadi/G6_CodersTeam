const express = require('express')
const router = express.Router()

router.get('/api/register', (req, res) => {
    res.render("register");
  });

module.exports = router