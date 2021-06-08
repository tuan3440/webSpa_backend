var serviceModel = require('../models/service.model')
var billModel = require('../models/bill.model')

let controller = {}

module.exports = controller
controller.index= async (req,res)=>{
	try{
		let service= await serviceModel.find();
		res.json(service);
	}
	catch(err){
		console.log(err)
		res.status(500).json({ error: err })
	}
}

controller.viewDetail = async (req,res)=>{
	try{
		let id = req.params.id;
		let service= await serviceModel.findOne({ _id: id });
		res.json(service);
	}
	catch(err){
		console.log(err)
		res.status(500).json({ error: err })
	}
}

controller.serviceCreate = async (req,res)=>{
	try {
		console.log(req.file.path)
		console.log(req.body.description)
		req.body.imgUrl = req.file.path.slice(6, req.file.path.length);
		console.log(req.body.imgUrl)
		let newService = await serviceModel.create({name:req.body.name,price:req.body.price,description:req.body.description,img:req.body.imgUrl});
		res.json(newService);
	}
	catch (err) {
		console.log(err)
		res.status(500).json({ error: err })
	}
}
controller.updateService= async (req,res) =>{
	try{
		let id = req.params.id;
		if(req.file){
			req.body.img = req.file.path.split('\\').slice(1).join('/');
			let updateService= await serviceModel.findOneAndUpdate({_id:id},
				{name:req.body.service,price:req.body.price,description:req.body.description,img:"../"+req.body.img},
				{new:true})
			res.json(updateService);
		}
		else{
			let updateService= await serviceModel.findOneAndUpdate({_id:id},{name:req.body.service,price:req.body.price,description:req.body.description},{new:true})
			res.json(updateService);
		}
	}
	catch(err){
		console.log(err)
		res.status(500).json({ error: err })
	}
}
controller.deleteService= async (req,res) =>{
	try{
		let id = req.params.id;
		let deleteService= await serviceModel.remove({_id:id})
		res.json(deleteService);
	}
	catch(err){
		console.log(err)
		res.status(500).json({ error: err })
	}
}


