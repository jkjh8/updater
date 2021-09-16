const Devices = require('../../models/devices')
const barix = require('./barix')
const qsys = require('./qsys')

module.exports.get = async () => {
  const devices = await Devices.find()
  devices.forEach(async (device) => {
    if (device.type === 'Barix') {
      await barix.get(device)
    } else if (device.type === 'QSys') {
      qsys.updateDevice(device)
    }
  })
}
