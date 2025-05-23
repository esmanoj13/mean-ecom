import Brand from "../db/brand.js"
const getbrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        if (!brands) {
            res.status(404).json({ error: "Brand not found." })
        }
        res.status(200).json(brands);
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({
            error: "An error occurred get the brand"
        })
    }
}

const addBrands = async (req, res) => {
    console.log("addbrands");
    try {
        const { name } = req.body;
        const brand = new Brand({ name });
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

const getBrand = async (req, res) => {
    try {
        let model = req.body;
        let id = req.params.id;
        const brand = await Brand.findById({
            _id: id
        }, model);
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

export { getbrands, addBrands, deleteBrand, updateBrand, getBrand }