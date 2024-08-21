const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to DB')

mongoose.connect(url)
  .then(result => {
    console.log('connected to DB')
  })
  .catch(error => {
    console.log('error connecting to DB', error.message)
  })

const entrySchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    required: true,
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /\d{2,3}-\d+$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number`
    }
  }
})

entrySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Entry', entrySchema)