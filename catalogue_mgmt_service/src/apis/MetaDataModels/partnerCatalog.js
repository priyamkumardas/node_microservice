const mongoose = require('mongoose')

const PartnerCatalogSchema = new mongoose.Schema({

    url: {
        type: String,
    },
    userId: {
        type: String
    },
    active: {
        type: Boolean,
    }
},
    { timestamps: true },
    {
        versionKey: 'version',
    }
);
PartnerCatalogSchema.pre('save', function (next) {
    this.increment();
    return next();
});
const PartnerCatalog = mongoose.model('PartnerCatalog', PartnerCatalogSchema)
module.exports = PartnerCatalog;