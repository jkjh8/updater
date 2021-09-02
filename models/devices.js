const mongoose = require('mongoose')

const devicesSchema = new mongoose.Schema({
  index: { type: Number },
  name: { type: String },
  mac: { type: String, unique: true },
  ipaddress: { type: String, unique: true, required: true },
  type: { type: String, required: true },
  mode: { type: String },
  alarm: { type: Boolean, default: false },
  description: { type: String },
  auth: { type: Array },
  checked: { type: Boolean, default: false, required: true },
  status: { type: Boolean, default: false, required: true },
  failedAt: { type: Date }
}, { timestamps: true })

const Device = mongoose.model('Device', devicesSchema)
module.exports = Device
