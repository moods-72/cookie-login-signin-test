const express = require("express");
const router = express.Router();

router.get("/signup", (req, res)=>{
    res.status(200).send({ msg: "On sign up page." });
});

module.exports = router;