const {Schema, model} = require ('mongoose')
const Joi = require('joi')

const {handleMongooseError} = require("../helpers")

const nameRegex = /^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$/
const emailMinDomainSegments = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const phonePattern = /\+?\d{1,4}?[ .\-\s]?\(?\d{1,3}?\)?[ .\-\s]?\d{1,4}[ .\-\s]?\d{1,4}[ .\-\s]?\d{1,9}/

const contactSchema = new Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 30,
        unique: true,
        required: [true, 'Set name for contact'],
        match: [nameRegex, 'First name and last name must be capitalized'],
    },
    email: {
        type: String,
        unique: true,
        match: [emailMinDomainSegments, 'Invalid email format'],
    },
    phone: {
        type: String,
        unique: true,
        match: [phonePattern, 'Invalid phone format'],
    },
    favorite: {
        type: [Boolean, 'Favorite must be true or false'],
        default: false,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    }
},
{versionKey: false, timestamps: true})

contactSchema.post("save", handleMongooseError)

const addContactSchema = Joi.object({
    name: Joi.string().regex(nameRegex).required(),
    email: Joi.string().email(emailMinDomainSegments).required(),
    phone: Joi.string().pattern(phonePattern).required(),
})

const updateContactSchema = Joi.object({
    name: Joi.string().regex(nameRegex).min(3).max(30).required(),
    email: Joi.string().email(emailMinDomainSegments).required(),
    phone: Joi.string().pattern(phonePattern).required(),
})

const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
})

const schemas = {
    addContactSchema,
    updateContactSchema,
    updateFavoriteSchema,
}

const Contact = model("contact", contactSchema)

module.exports = {
    Contact, 
    schemas,
}