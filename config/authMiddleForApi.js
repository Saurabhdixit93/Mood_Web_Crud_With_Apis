const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports.authenticateUser = async (req,res,next) => {
  
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null){
        return res.status(401).json({
            message: 'Token is missing'
        });
    }

    await jwt.verify(token,process.env.JWT_SECRET, (error , user) =>{
        if(error){
            return res.status(403).json({
                message: 'Internal Server Error'
            });
        }
        req.user = user;
        next();
    });
};

