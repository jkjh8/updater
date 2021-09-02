const mongoose = require('mongoose')

const pageSchema = new mongoose.Schema({
  channel: { type: Number },
  active: { type: Boolean },
  gain: { type: Number },
  name: { type: String },
  mute: { type: Boolean },
  pagegain: { type: Number },
  pagemute: { type: Boolean },
  message: { type: String },
  messagegain: { type: Number },
  messagemute: { type: Boolean },
  priority: { type: Number },
  source: { type: Number },
  squelch: { type:Number },
  squelchactive : { type: Boolean },
  bgmgain: { type: Number },
  bgmchannel: { type: Number }
})

const txSchema = new mongoose.Schema({
  channel1gain: { type: Number },
  channel2gain: { type: Number },
  channel1mute: { type: Boolean },
  channel2mute: { type: Boolean },
  datarate: { type: String },
  enable: { type: Boolean },
  format: { type: String },
  host: { type: String },
  interface: { type: String, default: 'Auto' },
  meter1: { type: Number },
  meter2: { type: Number },
  multicastttl: { type: Number },
  port: { type: Number },
  protocol: { type: String },
  status: { type: String },
  statusled: { type: Boolean },
  svsiaddress: { type: String },
  svsistream: { type: Number }
})

const rxSchema = new mongoose.Schema({
  channel1gain: { type: Number },
  channel2gain: { type: Number },
  channel1mute: { type: Boolean },
  channel2mute: { type: Boolean },
  enable: { type: Boolean },
  url: { type: String },
  interface: { type: String, default: 'Auto' },
  channel1peaklevel: { type: Number },
  channel2peaklevel: { type: Number },
  netcache: { type: Number },
  status: { type: String },
  statusled: { type: Boolean }
})

const stationSchema = new mongoose.Schema({
  mode: { type: String },
  priority: { type: Number },
  ready: { type: Boolean }

})

const qsysSchema = new mongoose.Schema({
  ipaddress: { type: String, unique: true, required: true },
  channels: { type: Number, default: 16 },
  bgmchannel: { type: Number, default: 4 },
  Platform: { type: String },
  State: { type: String },
  DesignName: { type: String },
  DesignCode: { type: String },
  IsRedundant: { type: Boolean },
  IsEmulator: { type: Boolean },
  Status: { type: Object },
  zone:[pageSchema],
  tx1:[txSchema], tx2:[txSchema], tx3:[txSchema], tx4:[txSchema],
  tx5:[txSchema], tx6:[txSchema], tx7:[txSchema], tx8:[txSchema],
  tx9:[txSchema], tx10:[txSchema], tx11:[txSchema], tx12:[txSchema],
  tx13:[txSchema], tx14:[txSchema], tx15:[txSchema], tx16:[txSchema],
  tx17:[txSchema], tx18:[txSchema], tx19:[txSchema], tx20:[txSchema],
  tx21:[txSchema], tx22:[txSchema], tx23:[txSchema], tx24:[txSchema],
  tx25:[txSchema], tx26:[txSchema], tx27:[txSchema], tx28:[txSchema],
  tx29:[txSchema], tx30:[txSchema], tx31:[txSchema], tx32:[txSchema],
  rx1:[txSchema], rx2:[txSchema], rx3:[txSchema], rx4:[txSchema],
  rx5:[txSchema], rx6:[txSchema], rx7:[txSchema], rx8:[txSchema],
  rx9:[txSchema], rx10:[txSchema], rx11:[txSchema], rx12:[txSchema],
  rx13:[txSchema], rx14:[txSchema], rx15:[txSchema], rx16:[txSchema],
  rx17:[txSchema], rx18:[txSchema], rx19:[txSchema], rx20:[txSchema],
  rx21:[txSchema], rx22:[txSchema], rx23:[txSchema], rx24:[txSchema],
  rx25:[txSchema], rx26:[txSchema], rx27:[txSchema], rx28:[txSchema],
  rx29:[txSchema], rx30:[txSchema], rx31:[txSchema], rx32:[txSchema],
  failedAt: { type: Date }
}, { timestamps: true })



qsysSchema.pre('updateOne', (next) => {
  this.updatedAt = Date.now()
  next()
}, {
  timestamps: true
})

const QsysPage = mongoose.model('QsysPage', pageSchema)
const Qsys = mongoose.model('Qsys', qsysSchema)
module.exports = Qsys
