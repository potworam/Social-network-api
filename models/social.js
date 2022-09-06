const { Schema, model } = require('mongoose');

const SocialSchema = new Schema({
    UserName: {
        type: String
    },
    Email: {
        type: String
    },
    Thoughts: {

    },
    Friends: {

    }
})
// create the Pizza model using the PizzaSchema
const Social = model('Social', SocialSchema);

// export the Pizza model
module.exports = Social;