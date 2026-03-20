require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

const app = express()

app.get('/', (req, res) => {
    res.json({msg: 'Welcome to gatorConnectors'})
})

mongoose.connect(process.env.MONGO)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('listening on port')
        })
    })
    .catch((error) => {
        console.log(error)
    })


