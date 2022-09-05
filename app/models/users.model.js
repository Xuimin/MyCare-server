module.exports = mongoose => {
  var schema = mongoose.Schema ({
    fullname: String,
    password: String,
    phone: String,
    ic: { type: String, default: "Not Set" },
    location: String,
    vaccine: { type: String, default: "Not Set" },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false }
  }, { timeStamps: true })

  const Users = mongoose.model("users", schema)
  return Users
}

