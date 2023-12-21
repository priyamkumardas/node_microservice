/* eslint-disable no-param-reassign */
const {
    // eslint-disable-next-line no-unused-vars
    ErrorHandler: { INTERNAL_SERVER_ERROR },Logger:log
} = require('sarvm-utility');
const { OrganizationService } = require('@services/v1');
const { ErrorHandler } = require('@common/libs');

// eslint-disable-next-line max-len, no-unused-vars
const { DATA_BASE_ERROR } = ErrorHandler;


const getOrganizations = async () => {
    log.info({info: 'Organization Controller :: inside get organization'})
    const result = await OrganizationService.getOrganizations();
    return result;
}

const getOrganizationEmployees = async ({ id }) => {
    log.info({info: 'Organization Controller :: inside get organization Employee'})
    const result = await OrganizationService.getOrganizationEmployees(id);
    return result;
}

const createOrganization = async ({ name }) => {
    log.info({info: 'Organization Controller :: inside create organization'})
    const result = await OrganizationService.createOrganization({ name: name });
    return result;
}

const getOrganization = async ({ id }) => {
    log.info({info: 'Organization Controller :: inside get organization By id'})
    const result = await OrganizationService.getOrganization(id);
    return result;
}

const updateOrganization = async (args) => {
    log.info({info: 'Organization Controller :: inside update organization'})
    let { name, id } = args;
    const result = await OrganizationService.updateOrganization({ name, id });
    return result;
}

const deleteOrganization = async ({ id }) => {
    log.info({info: 'Organization Controller :: inside delete organization'})
    const result = await OrganizationService.deleteOrganization(id);
    return result;
}

module.exports = {
    getOrganizations,
    getOrganizationEmployees,
    createOrganization,
    getOrganization,
    updateOrganization,
    deleteOrganization
};
