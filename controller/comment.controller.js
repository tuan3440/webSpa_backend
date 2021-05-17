const commentModel = require('../models/comment.model')
const userModel = require('../models/user.model')
const jwtMethod = require('../jsonwebtoken/jwt.method');

const secretKey = process.env.ACCESS_TOKEN_SECRET || "Manh.1451999";
let controller = {}
controller.newComment = async (req, res) => {  
    let userId = await userModel.findById(req.user.id)
    let newCmt = await commentModel.create({
        user: userId._id,
        rate: req.body.rate,
        content: req.body.content
    })
    let allComments = await commentModel.find().populate('user', 'firstName lastName').exec()
    res.json(allComments)
}
controller.editComment = async(req, res) => {
    let cmt =  await commentModel.findById( req.body.cmtId ).exec()
    if (cmt.user == req.user.id){
        let editedCmt = await cmt.updateOne({content: req.body.content, rate: req.body.rate})
        await cmt.save();
        let allComments = await commentModel.find().populate('user', 'firstName lastName').exec()
        res.json({allComments, allow: true})
    } else{
        let allComments = await commentModel.find().populate('user', 'firstName lastName').exec()
        res.json({allComments, allow: false})
    }
}
controller.deleteComment = async(req, res) => {
    let cmt =  await commentModel.findById( req.body.cmtId ).exec()
    if (cmt.user == req.user.id){
        await commentModel.deleteOne({_id: req.body.cmtId}, (err) => console.log(err))
        let allComments = await commentModel.find().populate('user', 'firstName lastName').exec()
        res.json(allComments)
    } else{
        return res.status(401).send({ message: 'ko có quyền xoas' })
    }
}
controller.showCommment = async (req, res) => {
    const tokenClient = req.body.token || req.cookies.access_token
    if (!tokenClient){
        let allComments = await commentModel.find().populate('user', 'firstName lastName').exec()
        res.json({allComments, user: 'khach'})
    } else{
        req.user = await jwtMethod.verifyToken(tokenClient, secretKey);
        let allComments = await commentModel.find().populate('user', 'firstName lastName').exec()
        res.json({allComments, user: req.user.id})
    }
}
module.exports = controller