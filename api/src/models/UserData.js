import mongoose from 'mongoose'

const UserDataSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  payload:   { type: mongoose.Schema.Types.Mixed, default: {} },
  updatedAt: { type: Date, default: Date.now },
})

export const UserData = mongoose.model('UserData', UserDataSchema)
