// Todo: P5 Move this file to utility
const requestToCurl = (req) => {
  // const headers = Object.keys(req.headers).reduce((previous, header) => {
  //     return `${previous} -H '${header}: ${req.headers[header]}'`;
  // }, '');

  // const curl = `curl '${req.protocol}://${req.get('host')}${req.originalUrl}' -X ${
  //     req.method
  // } ${headers} -d '${JSON.stringify(req.body)}'`;
  return `curl '${req.protocol}://${req.get("host")}${req.originalUrl}' -X ${
    req.method
  } -H 'Content-Type: ${req.get("Content-Type")}' -d '${JSON.stringify(
    req.body
  )}'`;
  // -H 'Authorization: ${req.header('Authorization')}'
  // return curl;
};

module.exports = { requestToCurl };
