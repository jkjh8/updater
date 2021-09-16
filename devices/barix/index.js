const axios = require('axios')
const cheerio = require('cheerio')
const Devices = require('../../models/devices')

async function http (address) {
  try {
    const html = await axios.get(`http://${address}/status`)
    const $ = cheerio.load(html.data)
    const r = { hardware: {}, status: {}, network: {}, audio: {}, streaming: {}, io: {}, serial: {} }
    $('dd').each(function (idx, ele) {
      if ($(this).find('#hardware').attr('class')) {
        return r.hardware[$(this).find('#hardware').attr('class')] = $(this).find('#hardware').text().trim()
      }  
      else if ($(this).find('#status').attr('class')) {
        return r.status[$(this).find('#status').attr('class')] = $(this).find('#status').text().trim()
      }
      else if ($(this).find('#network').attr('class')) {
        return r.network[$(this).find('#network').attr('class')] = $(this).find('#network').text().trim()
      }
      else if ($(this).find('#audio').attr('class')) {
        return r.audio[$(this).find('#audio').attr('class')] = $(this).find('#audio').text().trim()
      }
      else if ($(this).find('#streaming').attr('class')) {
        return r.streaming[$(this).find('#streaming').attr('class')] = $(this).find('#streaming').text().trim()
      }
      else if ($(this).find('#io').attr('class')) {
        return r.io[$(this).find('#io').attr('class')] = $(this).find('#io').text().trim()
      }
      else if ($(this).find('#serial').attr('class')) {
        return r.serial[$(this).find('#serial').attr('class')] = $(this).find('#serial').text().trim()
      }
    })
    return r
  } catch (error) {
    return null
  }
}
module.exports.http = http
module.exports.get = async (obj) => {
  try {
    const getDeviceInfo = await http(obj.ipaddress)
    if (getDeviceInfo) {
      switch (getDeviceInfo.hardware.fwname) {
        case 'InstreamerKit':
          updateInstreamer(obj, getDeviceInfo)
          break
        case 'StreamingClientKit':
          updateExtreamer(obj, getDeviceInfo)
          break
      }
    } else {
      await Devices.updateOne({ _id: obj._id }, { status: false })
    }
  } catch (err) {
    await Devices.updateOne({ _id: obj._id }, { status: false })
  }
}

async function updateInstreamer (obj, info) {
  const r = await Devices.updateOne({
    _id: obj._id
  }, {
    status: true,
    detail: {
      fwname: info.hardware.fwname,
      uptime: parseInt(info.hardware.uptime),
      ticks: parseInt(info.hardware.ticks),
      status: info.status.status,
      hardware: {
        hwtype: info.hardware.hwtype,
        ipamtype: info.hardware.ipamtype,
        mac: info.hardware.mac,
        fw: info.hardware.fw
      },
      network: {
        ip: info.network.ip,
        netmask: info.network.netmask,
        gateway: info.network.gateway
      },
      audio: {
        inputleft: parseInt(info.status.audioinputleft),
        inputright: parseInt(info.status.audioinputright),
        outputleft: parseInt(info.status.audiooutputleft),
        outputright: parseInt(info.status.audiooutputright)
      },
      streaming: {
        stream1: info.streaming.stream1,
        stream2: info.streaming.stream2,
        stream3: info.streaming.stream3,
        stream4: info.streaming.stream4,
        stream5: info.streaming.stream5,
        stream6: info.streaming.stream6,
        stream7: info.streaming.stream7,
        stream8: info.streaming.stream8
      }
    }
  })
  return r
}

async function updateExtreamer (obj, info) {
  const r = await Devices.updateOne({
    _id: obj._id
  }, {
    status: true,
    detail: {
      fwname: info.hardware.fwname,
      uptime: info.hardware.uptime,
      ticks: parseInt(info.hardware.ticks),
      status: info.status.status,
      hardware: {
        hwtype: info.hardware.hwtype,
        ipamtype: info.hardware.ipamtype,
        mac: info.hardware.mac,
        fw: info.hardware.fw
      },
      network: {
        ip: info.network.ip,
        netmask: info.network.netmask,
        gateway: info.network.gateway
      },
      audio: {
        outputleft: parseInt(info.status.audiooutputleft),
        outputright: parseInt(info.status.audiooutputright)
      },
      streaming: {
        stream1: info.streaming.url1,
        stream2: info.streaming.url2,
        stream3: info.streaming.url3
      },
      io: {
        relay1: info.status.relay1,
        relay2: info.status.relay2,
        relay3: info.status.relay3,
        relay4: info.status.relay4,
        relay5: info.status.relay5,
        relay6: info.status.relay6,
        relay7: info.status.relay7,
        relay8: info.status.relay8
      }
    }
  })
  return r
}
