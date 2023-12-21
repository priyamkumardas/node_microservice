const {
    ErrorHandler: { INTERNAL_SERVER_ERROR }
} = require('sarvm-utility');
const db = require('@db');
const mongoose = require('mongoose');
const {
    ErrorHandler: { DUPLICATE_MOBILE_ERROR, MOBILE_CANT_UPDATE, DATA_BASE_ERROR, EMPLOYEE_DOES_NOT_EXIST },
} = require('@common/libs');
const { Logger: log } = require('sarvm-utility');
const { Organization,Employee } = require('@root/src/apis/models');
const { createKey } = require('./createUniqueIdNUmber');
const { amazonPresignedUrl } = require('./UploadDocuments');
const UsersService = require('./Users');

const getOrganizations = async () => {
    log.info({info: 'Organization Service :: inside get Organization' })
    try {
        const result = await Organization.find();
        return result;
    } catch (err) {
        throw new DATA_BASE_ERROR('Error in getting organization from DB');
    }
};

const getOrganizationEmployees = async (id) => {
    log.info({info: 'Organization Service :: inside get Organization employee' })
    try {
        const filter = { org_id: id }
        const result = await Employee.find(filter);
        return result;
    } catch (err) {
        throw new DATA_BASE_ERROR('Error in getting employees from DB');
    }
};

const createOrganization = async (args) => {
    log.info({info: 'Organization Service :: inside create Organization' })
    try {
        const result = await Organization.create(args);
        return result;
    } catch (err) {
        throw new DATA_BASE_ERROR('Error in creating organization from DB');
    }
};

const getOrganization = async (id) => {
    log.info({info: 'Organization Service :: inside get Organization by id' })
    try {
        const result = await Organization.findById(id);
        return result;
    } catch (err) {
        throw new DATA_BASE_ERROR('Error in getting organization from DB');
    }
};

const updateOrganization = async ({ name, id }) => {
    log.info({info: 'Organization Service :: inside update Organization' })
    try {
        const result = await Organization.findOneAndUpdate({ id }, { name });
        return result;
    } catch (err) {
        throw new DATA_BASE_ERROR("Error in updating organization from DB");
    }
};

const deleteOrganization = async (id) => {
    log.info({info: 'Organization Service :: inside delte Organization' })
    try {
        const result = await Organization.findByIdAndDelete(id);
        return result;
    } catch (err) {
        throw new DATA_BASE_ERROR('Error in removing organization from DB');
    }
};


module.exports = {
    getOrganizations,
    getOrganizationEmployees,
    createOrganization,
    getOrganization,
    updateOrganization,
    deleteOrganization
};
