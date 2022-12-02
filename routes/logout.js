const express = require("express");
let router = express.Router();

router
  /** Route to handle a POST to /logout. */
  .post("/", (req, res) => {
    req.session = null;
    res.redirect("/login");
  });

module.exports = router;