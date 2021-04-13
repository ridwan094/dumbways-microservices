const mongoose = require('mongoose');

const user = mongoose.Schema({
  email: { type: String, required: false },
  password: { type: String, required: false },
  name: { type: String, required: false },
  phone: { type: String, required: false },
  role: { type: String, required: false },
  profileId: { type: String, required: false },
}, {
  timestamps: true,
  collection: "users"
});

user.virtual('id').get(function() {
  return this._id
})

user.set('toObject', { virtuals: true })
user.set('toJSON', { virtuals: true })

export default mongoose.model('User', user);