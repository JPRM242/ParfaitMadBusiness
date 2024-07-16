const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT

app.use(bodyParser.json())
   .use(cors())

app.get('/', (req, res)=>{
  res.json('Hello, api ! 🫡')
})

const router = require('./src/routes/index')
app.use(router)

const db = require('./src/db/db')
db.connexion()

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})
