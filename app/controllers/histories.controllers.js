const db = require('../index')
const Histories = db.histories
const Users = db.users

// CHECK IN
exports.checkin = async (req, res) => {
  if(!req.body.location) {
      res.status(400).send({ message: "No location found!" })
      return 
    }
  
  const user = await Users.findOne({ isActive: true })

  // set current date and time
  let currentDateTime = new Date();
  let date = currentDateTime.getDate() + "/" + currentDateTime.getMonth() + 1 + "/" + currentDateTime.getFullYear()
  let time = currentDateTime.getHours() + ":" + currentDateTime.getMinutes()

  const histories = new Histories({
    location: req.body.location,
    date: date,
    time: time,
    userId: user.id
  })

  histories.save()
  .then(data => {  
    res.send({
      message: "Successfully Check-in",
      data
    }) 
  })
  .catch(err => {
    res.status(500).send({ message: err.message || "Failed to check in! Please try again." })
  })
}

// GET OWN HISTORY
exports.getOwn = (req, res) => {
  Histories.find({ isActive: true })
  .then(data => { res.send(data) })
  .catch(err => {
    res.status(500).send({ message: err.message || `Failed to get histories of user ${req.body.userId}.` })
  })
}