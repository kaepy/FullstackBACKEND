// 3.15: puhelinluettelo ja tietokanta step 3
// Tietojen poistaminen tietokannasta

require('dotenv').config()
const { response } = require('express')
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
let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
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
*/

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

// ID:n luonti 
/*
const generateId = () => {
    const maxId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0
    return maxId + 1
}*/

// Tiedon lisääminen
app.post('/api/persons/', (request, response) => {
    //const body = request.body

    //const name = body.name
    //const number = body.number
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
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => {
        return person.id === id
    })

    if (person) {
        // lähettää HTTP-pyynnön vastaukseksi parametrina olevaa JavaScript-olioa eli taulukkoa notes vastaavan JSON-muotoisen merkkijonon.
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// Tiedon poistaminen
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Info sivu
app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`)
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})