const { users } = require("../data/database");
const { getUserByEmail } = require("../helpers");
const express = require("express");
const bcrypt = require("bcryptjs");
const { body, check, validationResult } = require("express-validator");
let router = express.Router();

router
  /** GET route to handle reqeusts to /login. */
  .get("/", (req, res) => {
    const user = req.session.userID;
    if (user) return res.redirect("/urls");
    const templateVars = {
      user: users[user],
      errors: null
    };
    res.render("login", templateVars);
    req.session.errors = null;
  })

  /** Route to handle a POST to /login. */
  .post("/",[
    check("email").notEmpty().withMessage("The email field cannot be empty!"),
    body("password")
      .custom((value, { req }) => {
        const email = req.body.email;
        const user = getUserByEmail(email, users);
        if (user === null) {
          throw new Error("The email entered does not exist.");
        }
        const passwordMatch = bcrypt.compareSync(value, user.password);
        if (!passwordMatch) {
          throw new Error("Passwords do not match.");
        }
        return true;
      })
  ],(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const templateVars = {
        user: users[req.session.userID],
        errors: errors.array()
      };
      res.status(403);
      return res.render("login", templateVars);
    }
    
    const email = req.body.email;
    const user = getUserByEmail(email, users);
    req.session.userID = user.id;
    res.redirect("/urls");
  });


module.exports = router;