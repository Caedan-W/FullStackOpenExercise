//mongodb+srv://caedan:<password>@cluster0.jwuchqd.mongodb.net/
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]


// const url = 
//     `mongodb+srv://caedan:${password}@cluster0.jwuchqd.mongodb.net/noteApp?retryWrites=true&w=majority`

const url = 
    'mongodb+srv://caedan:20010211wst@cluster0.jwuchqd.mongodb.net/testNoteApp?retryWrites=true&w=majority'

mongoose.set('strictQuery',false)

logger.info('connecting to', url)

mongoose.connect(url)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        minLength: 5,
        required: true
    },
    important: Boolean
})

const Note = mongoose.model('Note', noteSchema)


const note = new Note({
    content: 'there are two notes',
    important: true
})

note.save().then(result => {
    console.log('note saved!')
})

const note2 = new Note({
    content: 'the first note is about HTTP methods',
    important: false
})

note2.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
})


Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})
