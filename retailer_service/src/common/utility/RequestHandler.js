const requestHandler = async (validateSchema, controllerFunction, args) => {
    //validate your schema/args here
    //validateSchema(args);
    return await controllerFunction(args);
};

module.exports = requestHandler;