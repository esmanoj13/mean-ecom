import Category from "../db/category.js";
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        if (!categories) {
            return res.status(404).json({ error: "Category not found." });
        }
        res.status(200).json(categories);
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({
            error: "An error occurred delete the category"
        })
    }
}

const addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = new Category({ name });
        await category.save();
        res.status(201).send(category.toObject());
    } catch (err) {
        res.status(500).json({ error: "An error occurred while saving the category." })
        console.error(err);
    }
}
const updateCategory = async (req, res) => {
    try {
        let model = req.body;
        let id = req.params.id;
        const category = await Category.findOneAndUpdate({
            _id: id
        }, model);
        if (!category) {
            return res.status(404).json({ error: "Category not found." });
        }
        res.send({ message: "ok" });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "An error occurred while saving the category"
        })
    }
}
const deleteCategory = async (req, res) => {
    try {
        let model = req.body;
        let id = req.params.id;
        const category = await Category.findOneAndDelete({
            _id: id
        }, model);
        if (!category) {
            return res.status(404).json({ error: "Category not found." });
        }
        return res.send({ message: "ok" });
    } catch (err) {
        return res.status(500).json({
            error: "An error occurred delete the category"
        })
    }
}

const getCategory = async (req, res) => {
    try {
        let model = req.body;
        let id = req.params.id;
        const category = await Category.findById({
            _id: id
        }, model);
        if (!category) {
            return res.status(404).json({ error: "Category not found." });
        }
        res.send(category.toObject());
    } catch (err) {
        res.status(500).json({
            error: "An error occurred get the category"
        })
    }
}

export { getCategory, addCategory, updateCategory, deleteCategory, getCategories };