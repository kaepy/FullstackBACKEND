// 3.17*: puhelinluettelo ja tietokanta step 5
// Tietokannassa olevan tiedon muuttaminen

require('dotenv').config()
const { response, request } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

// muuttujassa req.body oleva "data" muutetaan JSON-muotoon
// app.use(morgan('tiny'))
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

/*
app.get('/', (req, res) => {
    res.send('<h1>Hello Person!</h1>')
})
*/

// Näytä kaikki tiedot
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

/*
// ID:n luonti 
const generateId = () => {
    const maxId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0
    return maxId + 1
}*/

// Tiedon lisääminen
app.post('/api/persons/', (request, response) => {

    const { name, number } = request.body

    if (name === undefined) {
        return response.status(400).json({ error: 'name missing' })
    }

    if (number === undefined) {
        return response.status(400).json({ error: 'number missing' })
    }

    /*
    if (persons.some(person => person.name === body.name)) {
        return response.status(409).json({
            error: 'name must be unique'
        })
    }
    */

    const person = new Person({ name, number })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

// Yksittäisen tiedon näyttäminen
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

// Tiedon poistaminen
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// Tietojen muuttaminen
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    // findByIdAndUpdate parametrina tulee antaa normaali JavaScript-olio eikä uuden olion luomisessa käytettävä Note-konstruktorifunktiolla luotua oliota
    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatePerson => {
            response.json(updatePerson)
        })
        .catch(error => next(error))
})

// Info sivu
app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`)
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
  }

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})