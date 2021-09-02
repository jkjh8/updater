const express = require('express')
const Devices = require('../../models/devices')
const router = express.Router()

/* GET home page. */
router.post('/qsys', function (req, res) {
  const { Network, Design, System, PA, Page} = req.body
  Devices.findOne({ ipaddress: Network[0].Address }).then((current) => {
    console.log(current)
  }).catch(err => {
    console.error(err)
  })
  console.log(req.body.Network[0].Address)
  res.sendStatus(200)
})

module.exports = router;
