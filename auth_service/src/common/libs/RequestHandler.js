const axios = require('axios').default;

class RequestHandler {
  static instance = axios.create({
    baseURL: 'http://localhost:1205/apis/v1/',
    timeout: 1000,
  });

  constructor() {
    if (!RequestHandler.instance) {
      RequestHandler.instance = axios.create({
        baseURL: 'http://localhost:1205/apis/v1/',
        timeout: 1000,
      });
    }
    return RequestHandler.instance;
  }

  /**
   *
   * @param url:{String}, api path
   * @param method:{String}, HTTP method : (e.g. GET as default, POST, PUT, DELETE)
   * @param data: {Object}, Request Body
   * @returns
   */
  static async get({ url }) {
    const httpRequest = axios.get(url);
    return httpRequest.then((response) => response).catch((error) => error);
  }

  static async post({ url, data }) {
    const httpRequest = RequestHandler.instance.post(url, data);
    return httpRequest.then((response) => response).catch((error) => error);
  }

  static async put({ url, data }) {
    const httpRequest = RequestHandler.instance.put(url, data);
    return httpRequest.then((response) => response).catch((error) => error);
  }

  static async delete({ url, data }) {
    const httpRequest = RequestHandler.instance.delete(url, data);
    return httpRequest.then((response) => response).catch((error) => error);
  }

  static getInstance() {
    return RequestHandler.instance;
  }
}
module.exports = RequestHandler;
