require('dotenv').config()

const express = require('express')
const chalk = require('chalk')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const path = require('path')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))

app.use(require('./routes'))

mongoose.set('useNewUrlParser', true)
mongoose.set('useCreateIndex', true)

console.clear()
if (process.env.MONGO_DB) {
  mongoose.connect(process.env.MONGO_DB, err => {
      if (err) {
        console.log(chalk.red(`Error database: ${err}`))
        return
      }

      app.listen(process.env.PORT || 3333, err => {
        if (err) return console.error(chalk.red(err))  
        return console.warn(chalk.green('Server started ...'))
      })
    })
} else {
  console.error(chalk.red('Connection String not found.'))
}
