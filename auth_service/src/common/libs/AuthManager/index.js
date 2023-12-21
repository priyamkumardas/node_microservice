const {
  ErrorHandler: { ACCESSTOKEN_EXP_ERROR, REFRESHTOKEN_EXP_ERROR, UNAUTH_USER, INTERNAL_SERVER_ERROR }, Logger,
} = require('sarvm-utility');

const jwt = require('jsonwebtoken');
const config = require('@config');

const { HS256_TOKEN_SECRET, ACCESS_TOKEN_EXPIRESIN, REFRESH_TOKEN_EXPIRESIN } = config.jwt;

class AuthManager {
  /**
   * @param user: Object, contains user details fetched from the db
   * @returns tokens:accessToken, refreshToken
   */
  static async issueTokens(payload) {
    if (payload == null || typeof payload === 'undefined') {
      Logger.error({error: 'payload empty'});
      throw new UNAUTH_USER(new Error('payload empty'));
    }

    const accessTokenOptions = {
      subject: 'accessToken',
      algorithm: 'HS256', // default
      expiresIn: ACCESS_TOKEN_EXPIRESIN,
      notBefore: '120ms',
      issuer: 'sarvm:ums',
    };

    const refreshTokenOptions = {
      ...accessTokenOptions,
      subject: 'refreshToken',
      expiresIn: REFRESH_TOKEN_EXPIRESIN,
    };

    const accessToken = jwt.sign(payload, HS256_TOKEN_SECRET, accessTokenOptions);

    const { userId } = payload;
    const refreshTokenPayload = { userId, scope: [] };
    const refreshToken = jwt.sign(refreshTokenPayload, HS256_TOKEN_SECRET, refreshTokenOptions);

    let body = {};
    if (payload.scope[1] === "logisticsDelivery") {
      let { onbording, subscribed } = payload;
      body = {
        onbording,
        subscribed
      }
    }
    return Object.freeze({
      accessToken,
      refreshToken,
      body
    });
  }

  static async verifyToken(token) {
    // validate user according to role
    return jwt.verify(token, HS256_TOKEN_SECRET, (err, res) => {
      if (err) {
        throw err;
      } else return true;
    });
  }

  static async decodeAuthToken(req, res, next) {
    const authString = req.headers.authorization ?? '';
    if (authString == null || typeof authString === 'undefined') {
      return next();
    }

    // if (authString === TEMP_INTERNAL_SERVICES_API_KEY) {
    //   req.authPayload = {
    //     // Todo: isSystemUser: true | Update it
    //     isSystemUser: true,
    //     email: authString === TEMP_INTERNAL_SERVICES_API_KEY ? 'System' : 'Manual',
    //   };
    //   return next();
    // }
    const jwtSubject = authString.split(' ')[0];
    const jwtToken = authString.split(' ')[1];

    if (jwtToken == null || typeof jwtToken === 'undefined') {
      return next();
    }
    // // Todo: authString & jwtToken in same if clause
    // if (jwtToken === TEMP_INTERNAL_SERVICES_API_KEY) {
    //   req.authPayload = {
    //     isSystemUser: true,
    //     email: authString === TEMP_INTERNAL_SERVICES_API_KEY ? 'System' : 'Manual',
    //   };
    //   return next();
    // }

    return jwt.verify(jwtToken, HS256_TOKEN_SECRET, async (err, decoded) => {
      if (err || decoded.sub !== jwtSubject) {
        if (jwtSubject === 'accessToken') return next(new ACCESSTOKEN_EXP_ERROR(err));
        if (jwtSubject === 'refreshToken') return next(new REFRESHTOKEN_EXP_ERROR(err));
      }
      req.authPayload = decoded;
      return next();
    });
  }

  static requiresScopes(scopes) {
    return async (req, res, next) => {
      try {
        const { authPayload } = req;
        if (!authPayload) {
          // This error needs to be handled in a better way
          const err = new Error('Auth Payload does not exist');
          return next(new ACCESSTOKEN_EXP_ERROR(err));
        }
        let requestScopes = authPayload.scope ?? null;
        requestScopes = [].concat(requestScopes);
        authPayload.scope = requestScopes;

        // check for intersecting element
        const requiredScope = authPayload.scope.filter((value) => scopes.includes(value));
        if (requiredScope.length > 0) {
          return next();
        }
        throw Error('Not authenticated user');
      } catch (err) {
        return next(new UNAUTH_USER(err));
      }
    };
  }
}
module.exports = AuthManager;
