const jwtMethod = require('../jsonwebtoken/jwt.method');

const secretKey = process.env.ACCESS_TOKEN_SECRET || "Manh.1451999";

let isAuth = async (req, res, next) => {
	const tokenClient = req.body.token || req.cookies.access_token || req.cookies.token || req.headers["x-access-token"] || req.headers["user-token"] || req.headers["token"];

	if (!tokenClient) return res.status(401).json({
		message: 'không có token '
	})
	try {
		req.user = await jwtMethod.verifyToken(tokenClient, secretKey);
		next()
	}
	catch (err) {
		return res.status(403).json({
			message: 'không được phép truy cập'
		})
	}
}



let isAdmin = async (req, res, next) => {
	const tokenClient = req.body.token || req.cookies.access_token || req.cookies.token || req.headers["x-access-token"] || req.headers["user-token"] || req.headers["token"];
	if (!tokenClient) return res.status(401).json({
		message: 'không có token '
	})

	try {
		req.user = await jwtMethod.verifyToken(tokenClient, secretKey);
		if ((!req.user.role) || req.user.role != 2) throw new Error('không được phép truy cập');
		next()
	}
	catch (err) {
		return res.status(403).json({
			message: 'không được phép truy cập'
		})
	}
}




module.exports = { isAuth }

