const mongoose = require('mongoose')
const Logs = require('../models/eventlog')

mongoose.connect('mongodb://localhost/mediaserver', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
  // useCreateIndex: true,
  connectTimeoutMS: 1000
})

const db = mongoose.connection

db.once('open', () => {
  console.log('MongoDB connected...')
  const dbStartLog = new Logs({
    source: 'Server',
    category: 'info',
    zones: '서버',
    message: 'updater start'
  })
  dbStartLog.save()
})

db.on('error', () => {
  console.error('db connection error')
})

module.exports = db
