require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

var corsOption = {
  origin: process.env.ORIGIN
}

app.use(cors(corsOption));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

const db = require("./app/index") 
db.mongoose.connect(
  process.env.MONGODB_URI, 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  ).then(() => {
    console.log("Database successfully connected")
  }).catch(err => {
    console.log("Cannot connect to database", err)
    process.exit()
  })

app.get("/", (req, res) => {
  res.json({ message: "Welcome to MyCare!"});
});

require("./app/routes/histories.routes")(app);
require("./app/routes/users.routes")(app)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`)
})