var userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
let controller = {}
const jwtMethod = require('../jsonwebtoken/jwt.method');
const secretKey = process.env.ACCESS_TOKEN_SECRET || "Manh.1451999";

controller.getListUser = async (req, res) => {
    try {
        let listUser = await userModel.find()
        res.json(listUser);
    }
    catch (err) {
        res.status(500).json({ error: err })
    }
}

controller.getUserById = async (req, res) => {

    try {
        let id = req.user.id;
        let user = await userModel.findOne({ _id: id }).lean();
        delete user.isBlock
        delete user.role
        delete user.password

        res.json(user);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }

}



controller.checkUserByEmail = async (req, res) => {

    try {
        let email = req.email
        let user = await userModel.findOne({ email: email })
        if (!user) res.status(404).json("tài khoản không tồn tại");
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ error: err })
    }

}





controller.addUser = async (req, res) => {

    try {

        let userNew = new userModel(req.body)
        userNew = await userNew.save()
        res.json(userNew);
    }
    catch (err) {
        res.status(500).json({ error: err })
    }
}

controller.deleteUserById = async (req, res) => {

    try {
        let id = req.params.id
        let userDelete = await userModel.findByIdAndDelete(id)
        res.json(userDelete);
    }
    catch (err) {
        res.status(500).json({ error: err })
    }
}








controller.updateUserAdmin = async (req, res) => {

    try {
        let id = req.params.id || req.body._id
        if (req.body.password) delete req.body.password
        if (req.body.role) delete req.body.role
        let userUpdate = await userModel.findOneAndUpdate({ _id: id }, req.body, { new: true })

        res.json(userUpdate);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err })
    }


}

controller.updateProfile = async (req, res) => {  //khong sua duoc pass, role, isblock

    try {
        let id = req.user.id;

        if (req.body.isBlock) delete req.body.isBlock
        if (req.body.role) delete req.body.role
        if (req.body.password) delete req.body.password

        let userUpdate = await userModel.findOneAndUpdate({ _id: id }, req.body, { new: true });
        res.cookie('firstName', userUpdate.firstName, {
            maxAge: 60 * 24 * 60 * 60,
        })

        res.json(userUpdate);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err })
    }


}

controller.LockUser = async (req, res) => {
    try {
        let id = req.params.id;

        let userUpdate = await userModel.findOneAndUpdate({ _id: id }, { isBlock: true }, { new: true });
        res.json(userUpdate);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err })
    }
}

controller.unLockUser = async (req, res) => {
    try {
        let id = req.params.id;

        let userUpdate = await userModel.findOneAndUpdate({ _id: id }, { isBlock: false }, { new: true });
        res.json(userUpdate);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err })
    }
}

controller.changePass = async(req, res) => {
    console.log('server chnag huy')
    try {
        const tokenClient = req.cookies.access_token
        req.user = await jwtMethod.verifyToken(tokenClient, secretKey);
        let pass = await userModel.findById(req.user.id)
        const salt = await bcrypt.genSalt(10)
        const oldPass = req.body.oldPass
        let checkPass = await bcrypt.compare(oldPass, pass.password)
        let newPass = await bcrypt.hash(req.body.newPass, salt)
        let currentUser = await userModel.findById(req.user.id)
        if (checkPass) {
            await currentUser.updateOne({password: newPass})
            res.status(200).json({message: 'thanh cong'})
        } else res.status(403).json({message: 'that bai'})
    } catch (error) {
        
    }
}

module.exports = controller