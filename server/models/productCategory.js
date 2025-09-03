const { default: mongoose } = require("mongoose");

var productCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true,
        unique: true,
        validate: {
            validator: async function (title) {
                const category = await this.constructor.findOne({ title });
                return !category || category._id.equals(this._id);
            },
            message: 'Category title already exists'
        }

    }
}, {
    timestamps: true

})

module.exports = mongoose.model('ProductCategory', productCategorySchema)