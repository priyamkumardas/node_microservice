const{ validateRequestInput}=require('@common/libs/middleware');
const requestHandler = async (validateSchema, controllerFunction, args) => {
    //validate your schema/args here
    validateRequestInput(validateSchema,args);
    return await controllerFunction(args);
};

module.exports = {
    requestHandler
};