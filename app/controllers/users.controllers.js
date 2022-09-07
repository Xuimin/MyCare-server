const db = require('../index');
const bcrypt = require('bcryptjs')
const User = db.users

// REGISTER
exports.register = (req, res) => {
  const { fullname, phone, location, password, confirmPassword } = req.body

  if(!fullname || !phone || !location || !password || !confirmPassword){
    res.status(400).send({
      message: "Please fill in all required fields!"
    })
     return
  }

  let salt = bcrypt.genSaltSync(10)
  let hash = bcrypt.hashSync(password, salt)

  const users = new User({
    fullname,
    phone,
    location,
    password: hash
  })

  users.save()
  .then(data => {
    res.send({
      message: "Successfully Register!",
      data
    })
  })
  .catch(err => {
    res.status(500).send({ message: err.message || "Failed to sign up. Please try again." })
  })
}

// LOGIN
exports.login = async (req, res) => {
  const { phone, password } = req.body

  const user = await User.findOne({ phone })
  const activeUser = await User.findOne({ isActive: true })

  if(activeUser) {
    activeUser.isActive = false
    activeUser.save()
  }

  if(!user) {
    return res.status(400).send({
      message: "User doesn't exists! Please register."
    })
  }

  let isMatch = bcrypt.compareSync(password, user.password)

  if(!isMatch) return res.status(400).send({ message: "Invalid Credentials!" })

  user.isActive = true
  await user.save()

  return res.send({
    message: "Successfully Login!",
    user
  })
}

// LOGOUT
exports.logout = async (req, res) => {
  const user = await User.findOne({ isActive: true })

  user.isActive = false
  await user.save()

  return res.send({
    message: "Successfully Logout!",
    user
  })
} 

// UPDATE USER DETAILS
exports.updateOwnDetails = async (req, res) => {
  const { fullname, phone, password, confirmPassword, location } = req.body
  const user = await User.findOne({ isActive: true })
  const phoneNum = await User.findOne({ phone })
  
  let salt = bcrypt.genSaltSync(10)
  let hash = bcrypt.hashSync(password, salt)

  user.fullname = fullname
  user.phone = phone
  user.password = hash
  user.location = location

  await user.save()

  return res.send({
    message: "User Details Successfully Updated",
    user
  })
}

exports.getOwnDetails = async(req, res) => {
  User.findOne({ isActive: true })
  .then(data => { res.send(data) })
  .catch(err => {
    res.status(500).send({ message: err.message || `Failed to get details of user ${req.body.userId}` })
  })
}