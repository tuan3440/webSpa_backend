const { check } = require('express-validator');

let validationLogin= ()=>{
	return [
	check('user.email')
		.exists()
		.notEmpty().withMessage('vui lòng nhập email')
		.isEmail().withMessage('email không đúng định dạng'),

	check('user.password')
		.exists()
		.notEmpty().withMessage('vui lòng nhập password')
		.isLength({ min: 6 }).withMessage('mật khẩu tối thiểu 6 ký tự')

	]
}

module.exports= {validationLogin: validationLogin}