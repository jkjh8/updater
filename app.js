const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cron = require('node-cron')

const Devices = require('./models/devices')
const barix = require('./devices/barix')
const qsys = require('./devices/qsys')

const indexRouter = require('./routes/index')

require('./db')

const app = express()
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
// app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.json({limit: '5mb'}))
// app.use(express.urlencoded({limit: '50mb'}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

async function getDeviceInfo () {
  const devices = await Devices.find()
  devices.forEach(async (device) => {
    if (device.type === 'Barix') {
      barix.get(device.ipaddress)
    } else if (device.type === 'QSys') {
      // await qsys.getStatus(device.ipaddress)
      await qsys.paStatusUpdate(device.ipaddress)
    }
  })
}

cron.schedule('*/10 * * * * *', () => {
  getDeviceInfo()
})

module.exports = app
