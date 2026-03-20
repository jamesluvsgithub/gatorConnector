require('dotenv').config()

const express = require('express')

const app = express()

mongoose.connect(process.env.MONGO_DB_URI)
    .then(() => console.log("Connected to MongoDB!"))
    .catch(err => console.error(err))

app.get('/', (req, res) => {
    res.json({msg: 'Welcome to gatorConnectors'})
})

app.listen(process.env.PORT, () => {
    console.log('listening on port 4000')
})
