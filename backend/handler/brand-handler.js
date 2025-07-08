import Brand from "../db/brand.js"
const getbrands = async (req, res) => {
    try {
        const brands = await Brand.find().populate("categoryId");
        if (!brands) {
            res.status(404).json({ error: "Brand not found." })
        }
        console.log(brands);
        res.status(200).json(brands);
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({
            error: "An error occurred get the brand"
        })
    }
}

const addBrands = async (req, res) => {
    try {
        const { name, categoryId } = req.body;
        const brand = new Brand({ name, categoryId });
        await brand.save();
        res.status(201).send(brand.toObject());
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({
            error: "An error occurred add the brand"
        })
    }
}

const deleteBrand = async (req, res) => {
    try {
        let model = req.body;
        let id = req.params.id;
        const brand = await Brand.findByIdAndDelete({
            _id: id
        }, model);
        if (!brand) {
            res.status(404).json({ error: "Brand not found." })
        }
        res.send({ message: "ok" })
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({
            error: "An error occurred delete the brand"
        })
    }
}

const updateBrand = async (req, res) => {
    try {
        let model = req.body;
        let id = req.params.id;
        const brand = await Brand.findByIdAndUpdate({
            _id: id
        }, model);
        if (!brand) {
            res.status(404).json({ error: "Brand not found." })
        }
        res.send({ message: "ok" })
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({
            error: "An error occurred delete the brand"
        })
    }
}

const editBrand = async (req, res) => {
    try {
        let model = req.body;
        let id = req.params.id;
        const brand = await Brand.findById({
            _id: id
        }, model).populate("categoryId");;
        if (!brand) {
            res.status(404).json({ error: "Brand not found." })
        }
        res.send(brand.toObject());
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({
            error: "An error occurred get the brand"
        })
    }
}


export { getbrands, addBrands, deleteBrand, updateBrand, editBrand }