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

controller.stasticService = async (req,res) => {
	try{
		let services = await billModel.find({status : 3}).select('bookDate totalMoney');
		console.log(services)
		let data = [];
		let monthStart = services[0].bookDate.getMonth();
		let i = 0;
		// console.log(monthStart);
		// data[i] = orders[0];
		data[i] = {
			month : services[0].bookDate.getMonth() + 1,
			total : services[0].totalMoney
		}
		await services.map((service, index) => {
			if (index !== 0 ) {
				if (services[index].bookDate.getMonth() == monthStart) {
					data[i].total += service.totalMoney;
				} else {
					monthStart ++;
					i++;
					data[i] = {
						month : service.bookDate.getMonth() + 1,
						total : service.totalMoney
					}
				}
			}
		})
		console.log(data);
		res.json(data);
	}
	catch(err){
		console.log(err)
		res.status(500).json({ error: err })
	}
}

controller.stasticServiceCount = async (req,res) => {
	try{
		let bills = await billModel.find({status:3});
		let data = [];
		let serviceId = [];
		serviceId.push(bills[0].service.toString())
		data[bills[0].service.toString()] = 1;

		await bills.map((bill, index) => {
             if (index !== 0) {
             	if (serviceId.includes(bill.service.toString())) {
             		console.log('x')
					data[bill.service] += 1;
				} else {
             		serviceId.push(bill.service.toString());
					data[bill.service.toString()] = 1;
				}
			 }
		})

		let idServiecMax = 0;
		let max = 0;
		for (var key in data) {
			if (data[key] > max) {
				max = data[key];
				idServiecMax = key;
			}
		}

		console.log(idServiecMax);
		let t = await serviceModel.findById(idServiecMax);
		let result = [
			t, max
		]
		console.log(result)


		// let unwind = await billModel.find({status: 3})
		// const aggregatorOpts = [{
		// 	$unwind: "$items"
		// },
		// 	{
		// 		$group: {
		// 			_id: "$items.service",
		// 			count: { $sum: 1 }
		// 		}
		// 	}
		// ]
		// billModel.aggregate(aggregatorOpts).exec()
		// let services = await billModel.aggregate([
		// 	{
		// 		$group: {
		// 			_id: '$items.service',
		// 			points: {$count: '$items'}
		// 		}
		// 	}
		// ]);
		// console.log(services)
		// let data = [];
		// let monthStart = services[0].bookDate.getMonth();
		// let i = 0;
		// // console.log(monthStart);
		// // data[i] = orders[0];
		// data[i] = {
		// 	month : services[0].bookDate.getMonth() + 1,
		// 	total : services[0].totalMoney
		// }
		// await services.map((service, index) => {
		// 	if (index !== 0 ) {
		// 		if (services[index].bookDate.getMonth() == monthStart) {
		// 			data[i].total += service.totalMoney;
		// 		} else {
		// 			monthStart ++;
		// 			i++;
		// 			data[i] = {
		// 				month : service.bookDate.getMonth() + 1,
		// 				total : service.totalMoney
		// 			}
		// 		}
		// 	}
		// })
		// console.log(data);
		res.json(result);
	}
	catch(err){
		console.log(err)
		res.status(500).json({ error: err })
	}
}


