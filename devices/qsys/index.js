const QrcClient = require('qsys-qrc-client').default
const { commands } = require('qsys-qrc-client')
const Devices = require('../../models/devices')
const Qsys = require('../../models/qsys')

const connect = (address) => {
  const client = new QrcClient()
  client.socket.setTimeout(5000)
  client.on('connect', function () {
    console.log('qsys connect')
  })
  client.on('finish', function () {
    console.log('qsys finish ', address)
  })
  client.on('error', async function (e) {
    console.log('qsys error ', address, e)
    try {
      await Devices.updateOne({
        ipaddress: address.host
      }, {
        $set: {
          status: false
        }
      })
    } catch (err) {
      console.log(err)
    }
  })
  client.on('timeout', function () {
    console.error('q-sys connet timeout', address)
    client.end()
  })
  return client.connect({ host: address, port: 1710 })
}

const logon = async (client, username, password) => {
  return await client.send(commands.logon(username, password))
}

module.exports.getStatus = async (address) => {
  try {
    const client = await connect(address)
    // const user = await logon(client, 'admin', 'password')
    const status = await client.send(commands.getStatus())
    client.end()
    return status
  } catch (err) {
    return null
  }
}

module.exports.getNamedControls = async (address, controlNames) => {
  try {
    const client = await connect(address)
    const result = await client.send(commands.getNamedControls(controlNames))
    client.end()
    return result
  } catch (error) {
    return null
  }
}

module.exports.setNamedControl = async (address, controlName, spec) => {
  try {
    const client = await connect(address)
    const result = await client.send(commands.setNamedControl(controlName, spec))
    client.end()
    return result
  } catch (error) {
    return null
  }
}

module.exports.getComponents = async (address) => {
  try {
    const client = await connect(address)
    const result = await client.send(commands.getComponents())
    client.end()
    return result
  } catch (error) {
    return null
  }
}

module.exports.componentGetControls = async (address, componentName) => {
  try {
    const client = await connect(address)
    const result = await client.send(commands.componentGetControls(componentName))
    client.end()
    return result
  } catch (error) {
    return null
  }
}
module.exports.getComponentControls = async (address, componentName, controlNames) => {
  try {
    const client = await connect(address)
    const result = await client.send(commands.getComponentControls(componentName, controlNames))
    client.end()
    return result
  } catch (error) {
    return null
  }
}

module.exports.setComponentControls = async (address, componentName, controls) => {
  try {
    const client = await connect(address)
    const result = await client.send(commands.setComponentControls(componentName, controls))
    client.end()
    return result
  } catch (error) {
    return null
  }
}

const paInit = async (ipaddress, numOfCh = 16) => {
  const newQsys = new Qsys({
    ipaddress: ipaddress,
    channels: numOfCh
  })
  for (let i = 0; i < numOfCh; i++) {
    newQsys.zone.push({
      channel: i + 1,
      active: false,
      gain: 0,
      mute: false,
      name: '0',
      priority: 0,
      source: 0,
      squelch: 0,
      squelchactive: false,
      bgmgain: 0,
      bgmchannel: 1,
      pagegain: 0,
      pagemute: false,
      messagegain: 0,
      messagemute: false
    })
  }
  newQsys.save((err) => {
    if (err) { console.error(err) }
  })
  return newQsys
}

module.exports.paStatusUpdate = async (ipaddress) => {
  try {
    let channels = 16
    
    let db = await Qsys.findOne({ ipaddress: ipaddress })
    if (db) {
      channels = db.channels
    } else {
      db = await paInit(ipaddress)
    }

    const client = await connect(ipaddress)
    if (client) {
      await updatePAZones(db, client, channels)
      await updatePABgms(db, client, channels)
      client.end()
      await db.save()
    } else {
      return console.error('qsys not connected')
    }
  } catch (err) {
    console.error(err)
  }
}

const updatePAZones = async (db, client, channels) => {
  try {
    const controlNames = getPAControlNames(channels)
    const rt = await client.send(commands.getComponentControls('PA', controlNames))
    rt.Controls.forEach(control => {
      const name = control.Name.split('.')
      const idx = Number(name[1]) - 1
      const key = name[2] + (name[3] ? name[3]: '')
      for (let i = 0; i < channels; i++) {
        if (i === idx) {
          if (key === 'name' || key === 'message') {
            db.zone[idx][key] = control.String
            break
          }
          db.zone[i][key] = control.Value
          break
        }
      }
    })
  } catch (err) {
    console.error('update Pa Zones error', err)
  }
}

const updatePABgms = async (db, client, channels) => {
  const controlNames = getPAControlBgmNames(channels)
  const rt = await client.send(commands.getComponentControls('PA', controlNames))

  rt.Controls.forEach(control => {
    const idx = Number(control.Name.replace('bgm.router.select.', ''))
    for (let i = 0; i < channels; i++) {
      if (i === idx) {
        db.zone[i].bgmchannel = control.Value
        break
      }
    }
  })
}

const getPAControlNames = (channels) => {
  const controlNames = []
  for (let i = 0; i < channels; i++) {
    controlNames.push( `zone.${i + 1}.active`)
    controlNames.push( `zone.${i + 1}.gain`)
    controlNames.push( `zone.${i + 1}.mute`)
    controlNames.push( `zone.${i + 1}.name`)
    controlNames.push( `zone.${i + 1}.priority`)
    controlNames.push( `zone.${i + 1}.source`)
    controlNames.push( `zone.${i + 1}.message`)
    controlNames.push( `zone.${i + 1}.message.gain`)
    controlNames.push( `zone.${i + 1}.message.mute`)
    controlNames.push( `zone.${i + 1}.page.gain`)
    controlNames.push( `zone.${i + 1}.page.mute`)
    controlNames.push( `zone.${i + 1}.bgm.gain`)
  }
  return controlNames
}

const getPAControlBgmNames = (channels) => {
  const controlNames = []
  for (let i = 0; i < channels; i++) {
    controlNames.push( `bgm.router.select.${i + 1}`)
  }
  return controlNames
}
module.exports.paInit = paInit
