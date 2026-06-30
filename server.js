const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const { readdirSync } = require("fs");


//middlewere
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// @ENDPOINT
readdirSync('./routes')
.map((item)=> app.use('/api', require('./routes/'+item)
))



const PORT = 5000;
app.listen(5000, () => console.log(`server is running on port ${PORT}`));
