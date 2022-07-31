import jwt from 'jsonwebtoken'
import jwt_decode from 'jwt-decode';



const auth = async (req, res, next) => {
    try {
        const token =  req.headers.authorization.split(/\s+/)[1]
        const isCustomAuth = token.length < 500;

        let decodeData;

        if (token && isCustomAuth) {
            decodeData = jwt.verify(token, 'Malachi')
            req.userId = decodeData?.id;
        } else {
            decodeData = jwt_decode(token)
            req.userId = decodeData?.sub;
        }
        next();
    } catch (error) {
        console.log(error)
    }
}

export default auth;