const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())

morgan.token('body', req => {
  const { name, number } = req.body
  return JSON.stringify({ name, number })
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))

let persons = [
  {
    name: "Arto Lovelace",
    number: "040-123456",
    id: 2
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
]

app.get('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const newPerson = request.body
  
  if (!newPerson.name || !newPerson.number) {
    return response.status(400).json({ error: 'The fields are required' })
  }

  const isAddedName = persons.some(person => person.name === newPerson.name)

  if (isAddedName) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  newPerson.id = Math.floor(Math.random() * 1024)
  persons = persons.concat(newPerson)
  response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).json(persons)
})

const PORT = process.env.PORT || '3001'

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
