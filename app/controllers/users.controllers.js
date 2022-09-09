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

  // checking all inputs
  let checkPw = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()-+]).{8,}$/
  let checkPhone = /^[0-9]{9,10}$/gm

  if(phone.match(checkPhone) == null) {
    return res.status(400).send({
      message: "Phone should be at least 9-10 digit long."
    })
  }

  if(password.match(checkPw) == null) {
    return res.status(400).send({
      message: "Password should have at least 8 characters and contain alphabet, number and special symbols."
    })
  }

  if(password !== confirmPassword) {
    return res.status(400).send({
      message: "Confirm password and password are not the same."
    })
  }

  User.findOne({ phone }, (err, foundUser) => {
    if(foundUser) {
      res.status(400).send({ message: "User already exists! Please try with a different phone number." })
    } else {
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
  })
}

// LOGIN
exports.login = async (req, res) => {
  const { phone, password } = req.body

  const user = await User.findOne({ phone })
  const activeUser = await User.findOne({ isActive: true })

  if(activeUser) {
    if(activeUser.id !== user.id) {
      activeUser.isActive = false
      activeUser.save()
    }
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
  const { fullname, ic, password, confirmPassword, location } = req.body
  const user = await User.findOne({ isActive: true })

  if(!user) {
    return res.send({
     message: "You are not login!"
   })
 }

  // checking all inputs
  let checkPw = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()-+]).{8,}$/
  let checkIc = /^[0-9]{12}$/gm

  if(ic.match(checkIc) == null) {
    return res.status(400).send({
      message: "IC should be at 12 digit long."
    })
  }

  if(password.match(checkPw) == null && password != "") {
    return res.status(400).send({
      message: "Password should have at least 8 characters and contain alphabet, number and special symbols."
    })
  }

  if(password !== confirmPassword && password != "") {
    return res.status(400).send({
      message: "Confirm password and password are not the same."
    })
  }
  
  let hash = ""

  if(password !== "") {
    let salt = bcrypt.genSaltSync(10)
    hash = bcrypt.hashSync(password, salt)
  }

  user.fullname = fullname
  user.ic = ic
  user.password = password == "" ? user.password : hash
  user.location = location

  await user.save()

  return res.send({
    message: "User Details Successfully Updated!",
    user
  })
}

exports.getOwnDetails = async(req, res) => {
  User.findOne({ isActive: true })
  .then(data => { res.send(data) })
  .catch(err => {
    res.status(500).send({ message: err.message || `Failed to get details of user ${req.body.userId}.` })
  })
}

exports.exists = (req, res) => {
  User.findOne({ phone: req.body.phone })
  .then(data => res.send(data))
  .catch(err => {
    res.status.send({
      message: err.message || `User not found with ${req.body.phone}.`
    })
  })
}