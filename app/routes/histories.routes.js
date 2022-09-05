module.exports = app => {
  const histories = require('../controllers/histories.controllers');

  var router = require('express').Router();

  router.post("/", histories.checkin);
  router.get("/", histories.getOwn);

  app.use("/histories", router)
}