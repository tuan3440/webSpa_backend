var billModel = require('../models/bill.model');
let userModel = require('../models/user.model');
let sendMail = require('../controller/mailer.controller');
var serviceModel = require('../models/service.model')
let controller = {}
const fs = require('fs')
module.exports = controller

controller.index = async (req, res) => {
	try {
		let bill = await billModel.find().populate('service').populate("user", "point");
		res.json(bill);
	}
	catch (err) {
		console.log(err)
		res.status(500).json({ error: err })
	}
}

controller.billUser = async (req, res) => {
	try {
		let billUser = await billModel.find({ user: req.user.id }).populate('service');
		res.json(billUser);
	}
	catch (err) {
		console.log(err)
		res.status(500).json({ error: err })
	}
}

controller.newBill = async (req, res) => {
	try {

		let checkBill = await billModel.findOne({ userName: req.body.userName, phone: req.body.phone, bookHour: req.body.bookHour, bookDate: req.body.bookDate })
		if (checkBill) res.status(400).send({ message: "Người dùng đã đặt dịch vụ trước đó" })
		else {
			let code = Math.random().toString(36).substring(7);
			let newBill = await billModel.create({
				user: req.user.id, userName: req.body.userName, phone: req.body.phone, usedTime: req.body.usedTime,
				totalMoney: req.body.totalMoney,
				service: req.body.service,
				bookDate: req.body.bookDate,
				bookHour: req.body.bookHour,
                code : code
			});
			let checkUser = await userModel.findOne({ _id: req.user.id })
			data = "<h1>Hệ thống quản lí Spa Tuandz</h1>" +
				"<div>Cảm ơn bạn Tuấn đã tin tưởng và đặt lịch spa tại cửa hàng của chúng tôi</div>" +
				"<div>Để đặt lịch thành công vui lòng bạn chuyển tiền đặt cọc cho chúng tôi</div>" +
				"<div>Số tài khoản : 030099003692</div>" +
				"<div>Ngân hàng : MSB</div>" +
				"<div>Nội dung chuyển khoản ghi mã code : " + code +"</div>" +
				"<div>Số tiền : 500.000 vnđ</div>" +
				"<div>Cảm ơn và chúng tôi chờ bạn đến để phục vụ</div>";
			console.log(data)
			await sendMail(checkUser.email, "Thanh toán tiền đặt lịch", data);
			res.json(newBill);
		}

	}
	catch (err) {
		console.log(err)
		res.status(500).json({ error: err })
	}
}

controller.deleteBill = async (req, res) => {
	try {
		let id = req.params.id;
		let deleteBill = await billModel.remove({ _id: id })
		res.json(deleteBill);
	}
	catch (err) {
		console.log(err)
		res.status(500).json({ error: err })
	}
}
controller.updateStatus = async (req, res) => {
	try {
		let id = req.params.id || req.body.id;
		let status = req.body.status

		let updateStatus = await billModel.findOneAndUpdate({ _id: id }, { status: status }, { new: true }).populate('service').exec();
		if (status == 3) {
			if (req.user.id) {
				let checkUser = await userModel.findOne({ _id: req.user.id })
				checkUser.point += parseInt(updateStatus.totalMoney) / 1000
				checkUser.save()
			}
		}
		res.json(updateStatus);
	}
	catch (err) {
		console.log(err)
		res.status(500).json({ error: err })
	}
}

controller.checkSlot = async (req, res) => {
	try {
		let date = req.body.date;
		let listBill = await billModel.find({ bookDate: date })

		const bookHour = [
			{
				time: '7:30 am - 9:30 am'
			},
			{
				time: '10:00 am - 12:00 pm'
			},
			{
				time: '1:00 pm - 3:00 pm'
			},
			{
				time: '3:30 pm - 5:30 pm'
			},
			{
				time: '6:30 pm - 8:30 pm'
			}
		]
		let slots = bookHour.map((hour) => {
			let count = 5
			listBill.forEach((bill) => {
				if (bill.bookHour == hour.time) count--
			})
			return count
		})
		res.json(slots);
	}

	catch (err) {
		// console.log(err)
		res.status(500).json({ error: err })
	}
}

controller.stasticBill = async (req, res) => {
	try {
		let data = [];
		for(let i = 1; i<=12 ; i++) {
			data.push({
				month : i,
				total : 0
			})
		}
		let bills = await billModel.find({status : 3}).select('bookDate totalMoney');
        if (bills.length > 0) {
        	await bills.map((bill, index) => {
        		let month = bill.bookDate.getMonth() + 1;
        		data[month].total += bill.totalMoney;
			})
			// let monthStart = bills[0].bookDate.getMonth();
			// let i = 0;
			// // console.log(monthStart);
			// // data[i] = orders[0];
			// data[i] = {
			// 	month : bills[0].bookDate.getMonth() + 1,
			// 	total : bills[0].totalMoney
			// }
			// await bills.map((bill, index) => {
			// 	if (index !== 0 ) {
			// 		if (bills[index].bookDate.getMonth() == monthStart) {
			// 			data[i].total += bill.totalMoney;
			// 		} else {
			// 			monthStart ++;
			// 			i++;
			// 			data[i] = {
			// 				month : bill.bookDate.getMonth() + 1,
			// 				total : bill.totalMoney
			// 			}
			// 		}
			// 	}
			// })
		}
        console.log(data)
		res.json(data);
	}
	catch (err) {
		console.log(err)
		res.status(500).json({ error: err })
	}
}

controller.stasticBillCount = async (req, res) => {
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
		res.json(result);
	}
	catch (err) {
		console.log(err)
		res.status(500).json({ error: err })
	}
}