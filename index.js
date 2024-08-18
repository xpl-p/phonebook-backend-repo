const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

let phonebook = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-l] - :response-time ms :body'))

const generateId = () => {
  return Math.floor(Math.random() * 1000000)
}

app.get('/api/phonebook', (req, res) => {
  res.json(phonebook)
})

app.get('/api/phonebook/:id', (req, res) => {
  const entry = phonebook.find(p => p.id === req.params.id)
  if (entry) {
    res.json(entry)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/phonebook/:id', (req, res) => {
  phonebook = phonebook.filter(p => p.id !== req.params.id)
  res.status(204).end()
})

app.post('/api/phonebook', (req, res) => {
  const body = req.body
  if (!body.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  }
  if (!body.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  }
  if (phonebook.find(p => p.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const entry = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  phonebook = phonebook.concat(entry)
  res.json(entry)

})

app.get('/info', (req, res) => {
  res.send(`Phonebook has ${phonebook.length} people <br /> ${new Date()}`)
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`running on port ${port}`)
})

