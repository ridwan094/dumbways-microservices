const mongoose = require('mongoose');

const skill = mongoose.Schema({
  name: { type: String, required: false },
  userId: { type: String, required: true },
}, {
  timestamps: true,
  collection: "skills"
});

skill.virtual('id').get(function() {
  return this._id
})

skill.set('toObject', { virtuals: true })
skill.set('toJSON', { virtuals: true })

export default mongoose.model('Skill', skill);