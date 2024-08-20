const mongoose = require('mongoose')

if (process.argv.length !== 5 && process.argv.length !== 3) {
  console.log('incorrect # of arg, expects: (password, name, number) or (password)')
  process.exit(1)
}


const password = process.argv[2]
const url = `mongodb+srv://xplprogram:${password}@cluster0.xtncy.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const entrySchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Entry = mongoose.model('Entry', entrySchema)

if (process.argv.length === 5) {
  const entry = new Entry({
    name: process.argv[3],
    number: process.argv[4]
  })

  entry.save().then(result => {
    console.log('saved');
    mongoose.connection.close()
  })
} else {
  Entry.find({}).then(result => {
    result.forEach(entry => {
      console.log(`${entry.name} ${entry.number}`)
    })
    mongoose.connection.close()
  })
}

