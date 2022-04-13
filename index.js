const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()


app.use(express.json())
morgan.token('type', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
app.use(cors())
app.use(express.static('build'))


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
    return Math.floor(Math.random()*10000)
}

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person) {
        response.json(person)
    }else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => {
        if(person.id !== id) {
            return person
        }})
    response.status(204).end()
})

app.post('/api/persons/', (request,response) => {
    const body = request.body
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }else if (body.name === "" || body.number === "" ){
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }else if (persons.find(person => person.name === request.body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    } else {
    const person = {
        name: request.body.name,
        number: request.body.number,
        id: generateId()
    }
    persons.concat(person)
    response.json(person)
    }
})

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} persons <br> ${new Date()}`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})