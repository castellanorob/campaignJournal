const Campaign = require('../models/Campaign');

const getCampaignsByIds = async (campaignIds) => {
    return await Campaign.findAll({
        where: {
            id: campaignIds
        }
    });
}

module.exports = { getCampaignsByIds };