
'use strict'
module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema


  const UserSchema = new Schema({
    _v: { type: Number, select: false },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    nickName: { type: String, required: true },
  }, { timestamps: true })

  return mongoose.model('User', UserSchema)
}
