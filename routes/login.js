var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.sendFile("/views/login.html", { root: "." });
});

module.exports = router;
