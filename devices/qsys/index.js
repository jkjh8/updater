const QrcClient = require('qsys-qrc-client').default
const { commands } = require('qsys-qrc-client')
const Devices = require('../../models/devices')
const Locations = require('../../models/location')
const Zones = require('../../models/zones')
const Qsys = require('../../models/qsys')

async function statusOn (obj) {
  Devices.updateMany({ ipaddress: obj.ipaddress}, { $set: { status: true } })
  Locations.updateMany({ ipaddress: obj.ipaddress}, { $set: { status: true } })
  Zones.updateMany({ ipaddress: obj.ipaddress}, { $set: { status: true } })
}

module.exports.updateDevice = async function (obj) {
  const client = new QrcClient()
  client.on('connect', async () => {
    await statusOn(obj)
    await updateZones(client, obj)
    await updateRx(client, obj)
    await updateTx(client, obj)
    client.end()
  })
  client.on('error', (e) => onError(e, obj, client))
  client.socket.on('timeout', () => client.end())
  client.connect({ host: obj.ipaddress, port: 1710 })
}

async function updateZones (client, obj) {
  const device = await Qsys.findOne({ ipaddress: obj.ipaddress })
  const zones = await client.send({ method: 'Component.GetControls', params: { Name: 'PA' } })
  const active = []
  zones.Controls.forEach(e => {
    for (let i = 0; i < device.zone.length; i++) {
      if (e.Name === device.zone[i].Name) {
        device.zone[i] = e
        break
      }
    }
  })
  //check active
  device.zone.forEach(e => {
    if (e.Name.match(/zone.\d+.active/)) {
      active.push(e)
    }
  })
  const result = active.some(e => e.Value === true)
  device.active = result
  await device.save()
  return result
}

async function updateRx (client, obj) {
  try {
    const device = await Devices.findOne({ ipaddress: obj.ipaddress })
    const qsys = await Qsys.findOne({ ipaddress: obj.ipaddress })

    for (let i = 0; i < device.rx; i++) {
      const r = await client.send({ method: 'Component.GetControls', params: { Name: `RX${i + 1}` } })
      r.Controls.forEach(e => {
        for (let j = 0; j < qsys.rx[i].length; j++) {
          if (qsys.rx[i][j].Name === e.Name) {
            qsys.rx[i][j] = e
            break
          }
        }
      })
    }
    qsys.save()
  } catch (err) {
    console.error('err', err)
  }
}

async function updateTx (client, obj) {
  try {
    const device = await Devices.findOne({ ipaddress: obj.ipaddress })
    const qsys = await Qsys.findOne({ ipaddress: obj.ipaddress })

    for (let i = 0; i < device.tx; i++) {
      const r = await client.send({ method: 'Component.GetControls', params: { Name: `TX${i + 1}` } })
      r.Controls.forEach(e => {
        for (let j = 0; j < qsys.tx[i].length; j++) {
          if (qsys.tx[i][j].Name === e.Name) {
            qsys.tx[i][j] = e
            break
          }
        }
      })
    }
    qsys.save()
  } catch (err) {
    console.error('err', err)
  }
}

const onError = async (e, obj, client) => {
  if (client) {
    client.end()
  }
  console.error(`Q-SYS IP: ${obj.ipaddress} 장비 정보 수집중 에러가 발생하였습니다.`, e)
  await Devices.updateOne({ ipaddress: obj.ipaddress }, { $set: { status: false } })
  await Locations.updateOne({ ipaddress: obj.ipaddress }, { $set: { status: false } })
  await Zones.updateOne({ ipaddress: obj.ipaddress }, { $set: { status: false } })
}