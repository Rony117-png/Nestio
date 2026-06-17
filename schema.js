const joi = require('joi');
const { countDocuments } = require('./models/listing');

module.exports.listingSchema = joi.object({
    Listing: joi.object({
        title: joi.string().required(),
        price: joi.number().required().min(0),
        description: joi.string().required(),
        country: joi.string().required(),
        location: joi.string().required()
    }).required()
});