const BigPromise = require('../middlewares/bigPromise');
const CustomError = require('../utils/customError');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.isLoggedIn = BigPromise(async (req, res, next) => {
	let token;

	if ((req.headers.authorization && req.headers.authorization.startsWith('Bearer'))) {
		token = req.headers.authorization.split(' ')[1];
		if (!token) {
            res.status(401)
			throw next(new CustomError('token is missing', 403));
		}
		//decode the token
		const decode = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findById(decode.id);
		next();
	}else{
		res.status(403)
		throw new CustomError('Unauthrorize');
	}
});
