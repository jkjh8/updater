const mongoose = require('mongoose')

const qsysDataSchema = new mongoose.Schema({
  Name: { type: String },
  Type: { type: String },
  Value: { type: Number },
  ValueMin: { type: Number },
  ValueMax: { type: Number },
  StringMin: { type: String },
  StringMax: { type: String },
  Position: { type: Number },
  String: { type: String },
  Direction: { type: String },
  Choices: { type: Array }
})

const qsysSchema = new mongoose.Schema({
  ipaddress: { type: String, unique: true, required: true },
  channels: { type: Number, default: 16 },
  bgmchannel: { type: Number, default: 4 },
  stations: { type: Number, default: 4 },
  Platform: { type: String },
  State: { type: String },
  DesignName: { type: String },
  DesignCode: { type: String },
  IsRedundant: { type: Boolean },
  IsEmulator: { type: Boolean },
  Status: { type: Object },
  active: { type: Boolean },
  zone:[qsysDataSchema],
  stations: [[qsysDataSchema]],
  tx:[[qsysDataSchema]],
  rx:[[qsysDataSchema]],
  failedAt: { type: Date }
}, {
  timestamps: true
})

// const QsysPage = mongoose.model('QsysPage', pageSchema)
const Qsys = mongoose.model('Qsys', qsysSchema)
module.exports = Qsys
