require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Entry = require('./models/entry')

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-l] - :response-time ms :body'))

app.get('/api/phonebook', (req, res) => {
  Entry.find({}).then(entries => {
    res.json(entries)
  })
})

app.get('/api/phonebook/:id', (req, res, next) => {
  Entry.findById(req.params.id)
  .then(entry => {
    if (entry) {
      res.json(entry)
    } else {
      res.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/phonebook/:id', (req, res, next) => {
  Entry.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/phonebook', (req, res, next) => {
  const body = req.body

  const entry = new Entry({
    name: body.name,
    number: body.number,
  })

  entry.save().then(savedEntry => {
    res.json(savedEntry)
  })
  .catch(error => next(error))
})

app.put('/api/phonebook/:id', (req, res, next) => {
  const { name, number } = req.body

  Entry.findByIdAndUpdate(req.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedEntry => {
      res.json(updatedEntry)
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
 Entry.find({}).then(result => {
  res.send(`Phonebook has ${result.length} people <br /> ${new Date()}`)
 })
})


const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  
  if(error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  
  next(error)
}

app.use(errorHandler)

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`running on port ${port}`)
})