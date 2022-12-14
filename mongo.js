const mongoose = require('mongoose')

// Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7
mongoose.set('strictQuery', false)

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const insertName = process.argv[3]
const insertNumber = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.cwjgrzg.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// Jos määrittelet modelin nimeksi Person, muuttaa Mongoose sen monikkomuotoon people, jota se käyttää vastaavan kokoelman nimenä.
// merkkijono Person määrittelee, että Mongoose tallettaa muistiinpanoa vastaavat oliot kokoelmaan nimeltään people, sillä Mongoosen konventiona on määritellä kokoelmien nimet monikossa (esim. people), kun niihin viitataan skeeman määrittelyssä yksikkömuodossa (esim. Person).
const Person = mongoose.model('Person', personSchema)

const printPhonebook = () => {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

const addToPhonebook = () => {
  const person = new Person({
    name: insertName,
    number: insertNumber,
  })

  person.save().then(() => {
    console.log(`added ${insertName} ${insertNumber} to phonebook`)
    mongoose.connection.close()
  })
}

if (process.argv[3] === undefined) {
  console.log('phonebook:')
  printPhonebook
} else {
  addToPhonebook()
}

