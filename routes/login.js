const express = require("express");
const router = express.Router();

const validateCookie = (req, res, next) => {
  const { cookies } = req;
  if ("session_Id" in cookies) {
    console.log("Session Id exists.");
    if (cookies.session_Id === "Carl123") next();
    else res.status(403).send({ msg: "Not authenticated" });
  } else res.status(403).send({ msg: "Not authenticated" });
};

/*  The validation only works after the cookie is sent to the client.
    Run without the "validateCookie" option in the route and then add
    it after the cookie has been sent to the client. This bug has to be 
    worked on.
*/  

router.get("/login", validateCookie, (req, res) => {
    res.cookie("session_Id", "Carl123");
    res.status(200).json({ msg: "Logged in" });
  });

module.exports = router;