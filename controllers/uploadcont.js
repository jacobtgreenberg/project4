const express = require('express')
const upload = express.Router()
const User = require('../models/usersmodel.js')
const Clicky = require('../models/clickmodel.js')


upload.put('/:id', (req, res) => {
    Clicky.findByIdAndUpdate(req.params.id, {inbox : false}, (err, updated) => {
        res.redirect('/inbox')
    })
})



module.exports = upload