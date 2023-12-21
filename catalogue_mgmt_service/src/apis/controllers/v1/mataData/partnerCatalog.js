const PartnerCatalog = require('../../../MetaDataModels/partnerCatalog')
const mongoose = require('mongoose');


const addPartnerCatalog = async ({ url, userId }) => {
    try {
        const session = mongoose.connection.startSession();
        try {
            (await session).startTransaction();
            const data = await PartnerCatalog.findOne({userId})
            if (!data) {
                const partnerCatalogStrcture = new PartnerCatalog({
                    url: url,
                    userId: userId,
                    active: true
                })
                await partnerCatalogStrcture.save()
            } else {
                await PartnerCatalog.findOneAndUpdate({userId}, { url: url })
            }
        } catch (error) {
            (await session).abortTransaction();
        } finally {
            (await session).endSession();
        }
    }
    catch (err) {
        throw new INTERNAL_SERVER_ERROR(err);
    }
}

module.exports = addPartnerCatalog