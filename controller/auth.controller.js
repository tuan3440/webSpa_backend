let userModel = require('../models/user.model');
let cartModel = require('../models/cart.model');

var { validationResult } = require('express-validator');

let bcrypt = require('bcryptjs')
const jwtMethod = require('../jsonwebtoken/jwt.method');
const authMiddleware = require('../middleware/auth.middleware');

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "5h";
const acesssSecretKey = process.env.ACCESS_TOKEN_SECRET || "Manh.1451999";
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "3650d";
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET || "Manh.1451999-Refesh";


let controller = {}

controller.login = async (req, res) => {

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array().map((err) => err.msg) })
        }

        else {
            let user = req.body.user;
            const checkUser = await userModel.findOne({ email: user.email }).lean();

            if (!checkUser) res.status(401).json({
                message: "email hoặc mật khẩu không đúng"
            })

            else {
                const checkPass = await bcrypt.compare(user.password, checkUser.password)

                delete checkUser.password;

                if (!checkPass) res.status(401).json({
                    message: "email hoặc mật khẩu không đúng"

                })


                else if (checkUser.isBlock) res.status(401).json({
                    message: "tài khoản đã bị khoá"

                })
                else {
                    const payloadUser = {
                        id: checkUser._id,
                        email: checkUser.email,
                        role: checkUser.role
                    }

                    const accessToken = await jwtMethod.generateToken(payloadUser, acesssSecretKey, accessTokenLife)
                    const refreshToken = await jwtMethod.generateToken(payloadUser, refreshSecretKey, refreshTokenLife)


                    res.cookie('access_token', accessToken, {
                        maxAge: 7*3600*1000,
                        httpOnly: true,
                        //secure: true;
                    })

                    res.cookie('refresh_token', accessToken, {
                        maxAge: 7*60*3600*1000,
                        httpOnly: true,
                        //secure: true;
                    })


                    return res.status(200).json({
                        message: "success",
                        access_token: accessToken,
                        refreshToken: refreshToken,
                        user: {
                            email: checkUser.email,
                            firstName: checkUser.firstName,
                            role: checkUser.role
                        }
                    })
                }


            }
        }




    }
    catch (err) {
        res.status(500).json({ err: err })
    }

}

controller.logout = async (req, res) => {
    try {


        res.clearCookie('access_token');
        res.clearCookie('refresh_token');

        res.json({ message: "logout success" })

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err })
    }
}


controller.refreshToken = async (req, res) => {

    try {

        const refreshTokenClient = req.body.refreshToken || req.cookies.refreshToken || req.cookies.refreshToken || req.headers["x-refresh-token"] || req.headers["refreshToken"];
        const userDecode = await jwtMethod.verifyToken(refreshTokenClient, refreshSecretKey);

        const payloadUser = {
            id: userDecode._id,
            email: userDecode.email
        }

        const accessToken = await jwtMethod.generateToken(payloadUser, acesssSecretKey, accessTokenLife)

        res.cookie('access_token', accessToken, {
            maxAge: 60 * 24 * 60 * 60,
            httpOnly: true,
            //secure: true;
        })



        res.status(200).json({
            message: "success",
            access_token: accessToken
        })


    }
    catch (err) {
        res.status(500).json(err)
    }


}

controller.register = async (req, res) => {

    const newUserClient = req.body;
    let userExits = await userModel.findOne({ email: newUserClient.email })

    console.log("check tài khoản", userExits)
    if (userExits) {
        res.status(400).json({ message: "tài khoản đã tồn tại" })
    }
    else {

        let newUser = new userModel(newUserClient);

        const salt = await bcrypt.genSalt(10)
        newUser.password = await bcrypt.hash(newUserClient.password, salt)

        newUser = await newUser.save();

        let newCart = new cartModel();  // tạo cart mới cho user

        newCart.user = newUser._id;

        await newCart.save();
        res.status(200).json({ message: "đã đăng ký thành công" })
    }
}


controller.loginAdmin = async (req, res) => {

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array().map((err) => err.msg) })
        }

        let user = req.body.user;
        const checkUser = await userModel.findOne({ email: user.email }).lean();

        if (!checkUser) res.status(401).json({
            message: "email hoặc mật khẩu không đúng"
        })

        const checkPass = await bcrypt.compare(user.password, checkUser.password)

        delete checkUser.password;

        if (!checkPass) res.status(401).json({
            message: "email hoặc mật khẩu không đúng"

        })

        if (!checkUser.isBlock) res.status(401).json({
            message: "tài khoản đã bị khoá"

        })

        if (checkUser.role !== 2) res.status(403).json({
            message: "không thể đăng nhập dưới quyền quản trị viên"

        })


        const payloadUser = {
            id: checkUser._id,
            email: checkUser.email,
            role: checkUser.role
        }

        const accessToken = await jwtMethod.generateToken(payloadUser, acesssSecretKey, accessTokenLife)
        const refreshToken = await jwtMethod.generateToken(payloadUser, refreshSecretKey, refreshTokenLife)


        res.cookie('access_token', accessToken, {
            maxAge: 60 * 24 * 60 * 600,
            httpOnly: true,
            //secure: true;
        })

        res.cookie('refresh_token', accessToken, {
            maxAge: 60 * 24 * 60 * 600,
            httpOnly: true,
            //secure: true;
        })


        return res.status(200).json({
            message: "success",
            access_token: accessToken,
            refreshToken: refreshToken,
            user: {
                email: checkUser.email,
                firstName: checkUser.firstName
            }
        })
    }
    catch (err) {
        res.status(500).json({ err: err })
    }

}




module.exports = controller
