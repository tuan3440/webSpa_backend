var productModel = require('../models/product.model')

let controller = {}


controller.getListProduct = async (req, res) => {
	try {
		let listProduct = await productModel.getListProduct()
		res.json(listProduct);
	}
	catch (err) {
		console.log(err)
		res.status(500).json({ error: err })
	}
}

controller.getProductById = async (req, res) => {

	try {
		let id = req.params.id
		let product = await productModel.findOne({ _id: id }).populate('category')
		res.json(product);
	}
	catch (err) {
		console.log(err)
		res.status(500).json({ error: err })
	}

}

controller.searchProduct = async (req, res) => {

	try {
		let keys = req.query.key
		if (keys) keys = keys.trim().toLowerCase().normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/đ/g, "d")
			.replace(/Đ/g, "D")
			.split(" ")

		let products = await productModel.find().populate('category');
		let result = products
		let result1 = []

		keys.forEach((key) => {
			result.forEach((product) => {


				if (
					product.name.toLowerCase().normalize("NFD")
						.replace(/[\u0300-\u036f]/g, "")
						.replace(/đ/g, "d")
						.replace(/Đ/g, "D").indexOf(key) != -1 ||
					product.summary.toLowerCase().normalize("NFD")
						.replace(/[\u0300-\u036f]/g, "")
						.replace(/đ/g, "d")
						.replace(/Đ/g, "D").indexOf(key) != -1 ||
					product.imgUrl.toLowerCase().normalize("NFD")
						.replace(/[\u0300-\u036f]/g, "")
						.replace(/đ/g, "d")
						.replace(/Đ/g, "D").indexOf(key) != -1 ||
					product.description.toLowerCase().normalize("NFD")
						.replace(/[\u0300-\u036f]/g, "")
						.replace(/đ/g, "d")
						.replace(/Đ/g, "D").indexOf(key) != -1 ||
					product.category.name.toLowerCase().normalize("NFD")
						.replace(/[\u0300-\u036f]/g, "")
						.replace(/đ/g, "d")
						.replace(/Đ/g, "D").indexOf(key) != -1 ||
					product.category._id.toString().toLowerCase().normalize("NFD")
						.replace(/[\u0300-\u036f]/g, "")
						.replace(/đ/g, "d")
						.replace(/Đ/g, "D").indexOf(key) != -1

				)
					result1.push(product)
			});

			result = result1;
			result1 = []

		})



		res.json(result);
	}
	catch (err) {
		console.log(err)
		res.status(500).json({ error: err })
	}

}




controller.getProductByCategory = async (req, res) => {

	try {
		let name = req.params.categoryName
		let products = await productModel.find().populate('category');

		products = products.filter((product) => name == product.category.name)

		res.json(products);
	}
	catch (err) {
		console.log(err)
		res.status(500).json({ error: err })
	}

}

controller.getProductByCategoryId = async (req, res) => {

	try {
		let id = req.params.categoryId
		let products = await productModel.find();

		products = products.filter((product) => id == product.category._id.toString())
        console.log(products);
		res.json(products);
	}
	catch (err) {
		console.log(err)
		res.status(500).json({ error: err })
	}

}





controller.addProduct = async (req, res) => {

	try {


		if (req.file) {
			// req.body.imgUrl = '/' + req.file.path.split('\\').slice(1).join('/');
			req.body.imgUrl = req.file.path.slice(6, req.file.path.length);
			console.log(req.body.imgUrl)
			console.log('đã có ảnh')
		}
		// else if (req.body.imgUrl) delete req.body.imgUrl


		let productNew = new productModel(req.body)
		productNew = await productNew.save()
		res.json(productNew);
	}
	catch (err) {
		console.log(err);
		res.status(500).json({ error: err })
	}
}

controller.deleteProductById = async (req, res) => {

	try {
		let id = req.params.id
		let productDelete = await productModel.findByIdAndDelete(id)
		res.json(productDelete);
	}
	catch (err) {
		console.log(err);
		res.status(500).json({ error: err })
	}
}




controller.editProduct = async (req, res) => {

	try {
		let product = new productModel(req.body)
		await product.save()
		res.json(product);
	}
	catch (err) {
		console.log(err);
		res.status(500).json({ error: err })
	}


}



controller.updateProduct = async (req, res) => {

	try {
		let id = req.body._id || req.params.id;

		if (req.file) {
			req.body.imgUrl = '/' + req.file.path.split('\\').slice(1).join('/');
			console.log('đã có ảnh')
		}
		// else if (req.body.imgUrl) delete req.body.imgUrl

		// if (req.body.category) delete req.body.category;

		console.log(id)

		let productUpdate = await productModel.findOneAndUpdate({ _id: id }, req.body, { new: true })


		res.json(productUpdate);
	}
	catch (err) {
		console.log(err);
		res.status(500).json({ error: err })
	}


}


controller.uploadImg = async (req, res) => {

	try {

		let fullPath = "không có file";
		let name = "không có tên"
		let length = 0

		if (req.file) {
			fullPath = req.file.path.split('\\').slice(1).join('/');
			length = req.file.length
		}
		if (req.body.name) name = req.body.name;


		res.json({ fullPath, name, length });
	}
	catch (err) {
		console.log(err);
		res.status(500).json({ error: err })
	}


}



module.exports = controller