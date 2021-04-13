const mongoose = require('mongoose');

const todo = mongoose.Schema({
  title: { type: String, required: false },
  isDone: { type: Boolean, required: false },
  userId: { type: String, required: false },
});

todo.virtual('id').get(function() {
  return this._id
})

todo.set('toObject', { virtuals: true })
todo.set('toJSON', { virtuals: true })

export default mongoose.model('Todo', todo);