const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    // save user who created it
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

// remove fields
CategorySchema.methods.toJSON = function () {
    const { __v, status, ...data } = this.toObject();
    return data;
}

module.exports = model('Category', CategorySchema);
