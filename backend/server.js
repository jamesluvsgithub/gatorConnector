require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

const app = express()

app.use(express.json());

const userRoutes = require('./src/routes/userRoutes');
app.use('/api/users', userRoutes);
app.use('/api/goals', goalRoutes);

app.get('/', (req, res) => {
    res.json({msg: 'Welcome to gatorConnectors'})
})

mongoose.connect(process.env.MONGO_DB_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('listening on port 4000')
        })
    })
    .catch((error) => {
        console.log(error)
    })


