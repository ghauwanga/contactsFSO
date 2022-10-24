
const express = require('express')
const loger = require('morgan')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

loger.token("payload", function (req) {
    return JSON.stringify(req.body)
})
app.use(loger(':method :url :status :res[content-length] - :response-time ms :payload'))


const persons = [
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
    const maxId = persons.length > 0
      ? Math.floor(Math.random() * 200)
      : 0
    return maxId
}

app.get('/api/persons/', (req, res) => {
    res.send(persons)
})

app.get('/info', (req, res) => {
    const leng = persons.length
    const date = new Date()
    let sendData = `<p style="text-align: center">Phonebook has info for ${leng} people <br> <br> ${date}</p>`
    res.send(sendData)
})

app.get('/api/persons/:id', (req, res) => {
    let id = +req.params.id
    let person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else{
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    let id = +req.params.id
    let person = persons.filter(person => person.id !== id)
    console.log(person);
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    let nameExist = persons.map(person => person.name).includes(body.name)
    let numberExist = persons.map(person => person.number).includes(body.number)

    if (!body.name ) {
        return res.status(400).json({
            error: 'name should not be empty'
        })
    } else if (!body.number) {
        return res.status(400).json({
            error: 'number should not be empty'
        })
    }else if (nameExist) {
        return res.status(400).json({
            error: 'name should be unique'
        })
    }else if (numberExist) {
        return res.status(400).json({
            error: 'number should be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    console.log(person)
    res.json(persons.concat(person))
})

app.listen(PORT, ()=>{
    console.log(`Server is running. \nVisit http://localhost:${PORT}`)
})