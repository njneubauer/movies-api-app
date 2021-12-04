require('dotenv').config();
const jwtSecret = process.env.secretKey;

const jwt = require('jsonwebtoken'),
    passport = require('passport');
const { initialize } = require('passport');

require('./passport');


let generateJWTToken = (user)=>{
    return jwt.sign(user, jwtSecret, {
        subject: user.username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}

// POST /login
module.exports = (router)=>{
    router.use(passport.initialize());
    router.post('/login', (req, res)=>{
        passport.authenticate('local', {session: false}, (error, user, info)=>{
            if (error || !user){
                return res.status(400).json({
                    message: 'something is not right',
                    user: user
                });
            }
            req.login(user, {session: false}, (error)=>{
                if (error){
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({user, token});
            });
        })(req,res);
    });
}