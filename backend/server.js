require('dotenv').config()

const express = require('express')

const app = express()

app.get('/', (req, res) => {
    res.json({msg: 'Welcome to gatorConnectors'})
})

app.listen(process.env.PORT, () => {
    console.log('listening on port 4000')
})
