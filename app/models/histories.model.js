module.exports = mongoose => {
  var schema = mongoose.Schema({
    location: String,
    date: String,
    time: String, 
    userId: String
  }, { timestamps: true })

  const Histories = mongoose.model('histories', schema);
  return Histories
};
