const joi = require('joi');
const { countDocuments } = require('./models/listing');

module.exports.listingSchema = joi.object({
    Listing: joi.object({
        title: joi.string().required(),
        price: joi.number().required().min(0),
        description: joi.string().required(),
        img: joi.object({
            url: joi.string().allow("", null)
        }),
        country: joi.string().required(),
        location: joi.string().required()
    }).required()
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        authorName: joi.string().trim().required(),
        comment: joi.string().required(),
        rating: joi.number().required().min(1).max(5)
    }).required()
}); 