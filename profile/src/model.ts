const mongoose = require('mongoose');

const profile = mongoose.Schema({
  address: { type: String, required: false },
  latestEducation: { type: String, required: false },
  userId: { type: String, required: true }
});

profile.virtual('id').get(function() {
  return this._id
})

profile.set('toObject', { virtuals: true })
profile.set('toJSON', { virtuals: true })

export default mongoose.model('Profile', profile);