const { compareSync } = require('bcryptjs')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const { secret } = require('./config/variables')
const {OAuth2Client} = require('google-auth-library')
const client = new OAuth2Client("43580613435-jloen18vc3cg889doto8tm70ss6q1rsu.apps.googleusercontent.com")
const  User = require('./models/User')

module.exports = new class {
    initialize(app) {

        app.use(bodyParser.json());

        // CORS setup
        app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization, userId, userType, tokenId"
            );
            res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PATCH, PUT, DELETE, OPTIONS"
            );
            if(req.method === 'OPTIONS') {
                return res.sendStatus(200);
            }
            next();
        });
    }

    graphQLAuthentication(req,res,next) {
        let decodedToken = undefined;
        let token = undefined;
        if(req.get('Authorization'))
        {
            const authHeader = req.get('Authorization');
            if(!authHeader) {
                req.isAuth = false;
                return next();
            }
            token = authHeader.split(' ')[1];
        } else if(req.get('tokenid')) {
            token = req.get('tokenid');
              
        } else {
            console.log("here");
            req.isAuth = false;
            return next();
        }
       
        if(!token && token === '') {
            console.log("here 1");
            req.isAuth = false;
            return next();
        }
        try {
            decodedToken = jwt.verify(token, secret);
        } catch(err) {
            console.log("here2");
            console.log(e);
            req.isAuth = false;
            return next();
        }
        if(!decodedToken) {
            console.log("ol;kl;kl;kfk");
            req.isAuth = false;
            return next();
        }
        req.isAuth = true;
        // As we inserted the userId while encoding the token So, now we can access it after decoding
        req.userId = decodedToken.userId;
        next();
    }

    async isSuperAdmin(flag, userId) {
        /*
        This will be use when you want the route to be only used by the super-admin
        */ 
        return new Promise((resolve, reject) => {
            try {
              User.findOne({_id: userId})
                .then(user => {
                    if(user) {
                        if(!flag || user.type !== 'super-admin') {
                            const error = new Error('not authenticated');
                            error.code = 401;
                            return reject(error);
                        }
                        return resolve();
                    } else {
                        const error = new Error('not authenticated');
                        error.code = 401;
                        return reject(error);
                    }
                })
                .catch(e => {
                  return reject(e);
                });
            } catch (e) {
              return reject(e);
            }
          });       
    } 

    async isSuperAdminOrAdmin(flag, userId) {
        /*
        This will be use when you want the route to be use only by the super-admin or admin
        */ 
        return new Promise((resolve, reject) => {
            try {
              User.findOne({_id: userId})
                .then(user => {
                    if(user) {
                        if(!flag || (user.type !== 'super-admin' && user.type !== 'admin')) {
                            const error = new Error('not authenticated');
                            error.code = 401;
                            return reject(error);
                        }
                        return resolve();
                    } else {
                        const error = new Error('not authenticated');
                        error.code = 401;
                        return reject(error);
                    }
                })
                .catch(e => {
                  return reject(e);
                });
            } catch (e) {
              return reject(e);
            }
          });       
    } 
    
    async isSuperAdminOrAdminOrUser(flag, userId) {
        /*
        This will be use when you want the route to be used by the super-admin or admin or user
        */ 
        return new Promise((resolve, reject) => {
            try {
              User.findOne({_id: userId})
                .then(user => {
                    if(user) {
                        if(!flag || (user.type !== 'super-admin' && user.type !== 'admin' && user.type !== 'user')) {
                            const error = new Error('not authenticated');
                            error.code = 401;
                            return reject(error);
                        } 
                        return resolve();
                    } else {
                        const error = new Error('not authenticated');
                        error.code = 401;
                        return reject(error);
                    }
                })
                .catch(e => {
                  return reject(e);
                });
            } catch (e) {
              return reject(e);
            }
          });       
    } 

};