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

  const histories = new Histories({
    location: req.body.location,
    date: req.body.date,
    time: req.body.time,
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
exports.getOwn = async (req, res) => {
  const user = await Users.findOne({ isActive: true })
  Histories.find({ userId: user.id })
  .then(data => { res.send(data) })
  .catch(err => {
    res.status(500).send({ message: err.message || `Failed to get histories of user ${req.body.userId}.` })
  })
}