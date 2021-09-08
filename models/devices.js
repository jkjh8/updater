const mongoose = require('mongoose')

const devicesSchema = new mongoose.Schema({
  index: { type: Number },
  name: { type: String },
  mac: { type: String },
  ipaddress: { type: String, unique: true, required: true },
  type: { type: String, required: true },
  mode: { type: String },
  channels: { type: Number },
  stations: { type: Number },
  tx: { type: Number },
  rx: { type: Number },
  description: { type: String },
  auth: { type: Array },
  checked: { type: Boolean, default: false, required: true },
  status: { type: Boolean, default: false, required: true },
  // timestamp
  failedAt: { type: Date }
}, { timestamps: true })

const Device = mongoose.model('Device', devicesSchema)
module.exports = Device
