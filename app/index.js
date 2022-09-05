const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGODB_URI;

db.histories = require('./models/histories.model')(mongoose);
db.users = require("./models/users.model.js")(mongoose);

module.exports = db