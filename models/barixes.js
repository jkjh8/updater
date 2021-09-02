const mongoose = require('mongoose')

const barixSchema = new mongoose.Schema({
  ipaddress: { type: String, unique: true, required: true },
  fwname: { type: String },
  uptime: { type: Number },
  ticks: { type: Number },
  status: { type: String },
  hardware: {
    hwtype: { type: String },
    ipamtype: { type: String },
    mac: { type: String },
    fw: { type: String }
  },
  network: {
    ip: { type: String },
    netmask: { type: String },
    gateway: { type: String }
  },
  audio: {
    inputleft: { type: Number },
    inputright: { type: Number },
    outputleft: { type: Number },
    outputright: { type: Number }
  },
  streaming: {
    stream1: { type: String },
    stream2: { type: String },
    stream3: { type: String },
    stream4: { type: String },
    stream5: { type: String },
    stream6: { type: String },
    stream7: { type: String },
    stream8: { type: String },
  },
  io: {
    relay1: { type: Number, default: 0 },
    relay2: { type: Number, default: 0 },
    relay3: { type: Number, default: 0 },
    relay4: { type: Number, default: 0 },
    relay5: { type: Number, default: 0 },
    relay6: { type: Number, default: 0 },
    relay7: { type: Number, default: 0 },
    relay8: { type: Number, default: 0 }
  },
  failedAt: { type: Date }
}, {
  timestamps: true
})

const Barixes = mongoose.model('Barixes', barixSchema)
module.exports = Barixes
