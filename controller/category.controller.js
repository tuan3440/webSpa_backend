var categoryModel = require('../models/category.model')
var productModel = require('../models/product.model')

let controller = {}


controller.getListCategory = async (req, res) => {
    try {
        let listCategory = await categoryModel.find()
        res.json(listCategory);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
}

controller.getCategoryById = async (req, res) => {

    try {
        let id = req.params.id
        let category = await categoryModel.findOne({ _id: id })
        res.json(category);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }

}




controller.addCategory = async (req, res) => {

    try {

        let categoryNew = new categoryModel(req.body)
        letcategoryNew = await categoryNew.save()
        res.json(categoryNew);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err })
    }
}


controller.deleteCategoryById = async (req, res) => {

    try {
        let id = req.params.id
        let categoryDelete = await categoryModel.findOneAndDelete({ _id: id })
        await productModel.deleteMany({ category: id })
        res.json(categoryDelete);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err })
    }
}


controller.deleteManyCategory = async (req, res) => {

    try {

        let ids = []
        req.body.map((item) => { ids.push(item._id) })
        let categoryDelete = await categoryModel.deleteMany({ _id: { $in: ids } });
        res.json(categoryDelete);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err })
    }
}







controller.editCategory = async (req, res) => {

    try {
        let category = new categoryModel(req.body)
        category = await category.save()
        res.json(category);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err })
    }


}



controller.updateCategory = async (req, res) => {

    try {
        let id = req.body._id;

        let categoryUpdate = await categoryModel.findOneAndUpdate({ _id: id }, req.body, { new: true })

        res.json(categoryUpdate);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err })
    }


}


module.exports = controller