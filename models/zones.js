const mongoose = require('mongoose')

const zonesSchema = new mongoose.Schema({
  index: { type: Number, unique: true },
  name: { type: String, },
  type: { type: String, default: 'Barix' },
  parent: { type: Object },
  device: { type: Object },
  channel: { type: Number },
  status: { type: Boolean },
  check: { type: Boolean, default: false },
  // timestamp
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true })

const Zones = mongoose.model('Zones', zonesSchema)
module.exports = Zones
