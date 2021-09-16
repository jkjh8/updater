const QrcClient = require('qsys-qrc-client').default
const { commands } = require('qsys-qrc-client')
const Devices = require('../../models/devices')

module.exports.updateDevice = async function (obj) {
  const client = new QrcClient()
  client.on('connect', async () => {
    await updateZones(client, obj)
    client.end()
  })
  client.on('error', async (e) => {
    console.error(`장비정보 수집중 오류가 발생하였습니다. Q-Sys: obj.ipaddress ${e}`)
    await Devices.findByIdAndUpdate(obj._id, { status: false })
  })
  client.socket.on('timeout', () => client.end())
  client.connect({ host: obj.ipaddress, port: 1710 })
}

async function updateZones (client, obj) {
  const zones = await client.send({ method: 'Component.GetControls', params: { Name: 'PA' } })
  const status = await client.send(commands.getStatus())

  const gain = []
  const mute = []
  const active = []
  zones.Controls.forEach(e => {
    if (e.Name.match(/zone.\d+.gain/)) {
      const channel = e.Name.replace(/[^0-9]/g, '')
      gain[channel - 1] = e.Value
    }
    if (e.Name.match(/zone.\d+.mute/)) {
      const channel = e.Name.replace(/[^0-9]/g, '')
      mute[channel - 1] = e.Value
    }
    if (e.Name.match(/zone.\d+.active/)) {
      const channel = e.Name.replace(/[^0-9]/g, '')
      active[channel - 1] = e.Value
    }
  })
  const result = await Devices.updateOne({
    _id: obj._id
  }, {
    gain, mute, active,
    detail: status,
    status: true
  })
  return result
}
