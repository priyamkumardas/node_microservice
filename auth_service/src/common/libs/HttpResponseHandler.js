class HttpResponseHandler {
  /**
   * Description: Returns an API as handled error response
   * @param req: Object, request object
   * @param res: Object, response object
   * @param message: String, error message
   * @param statusCode: Number, HTTP status code
   * @access public instance method
   * @return API Response Object
   */
  static error(req, res, errObj, statusCode = 200) {
    const response = {
      success: false,
      error: errObj,
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Description: Returns an API as handled error response
   * @param req: Object, request object
   * @param res: Object, response object
   * @param data: Object, API data
   * @param statusCode: Number, HTTP status code
   * @access public instance method
   * @return Response Object
   */
  static success(req, res, data, statusCode = 200) {
    const response = {
      success: true,
      data,
    };
    return res.status(statusCode).json(response);
  }
}

module.exports = HttpResponseHandler;
