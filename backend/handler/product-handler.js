// const Product = require("./../db/product");
// const Brand = require('./../db/brand');
// const Category = require('./../db/category');
import Product from "../db/product.js";
import multer from 'multer';
import Brand from "../db/brand.js";
import Category from "../db/category.js";
const upload = multer({ dest: 'public/images' });
const addProduct = async (req, res) => {
    try {
        let model = req.body;
        const imagePaths = req.files.map(file => '/images/' + file.filename);
        let product = new Product({
            ...model,
            images: imagePaths,
        });
        await product.save();
        res.status(201).json({
            success: true,
            message: "Product add successfully",
            product: product.toObject()
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Product is not add",
            error: err.message
        })
    }
}

//This is used for the  getting all the product
// async function addproduct(model) {
//     let product = new Product({
//             name=model.name,
//             shortdescription=model.shortdescription,
//             description= model.description,
//             price= model.price,
//             discount= model.discount,
//             category= model.category,
//         ...model,
//     });
//     await product.save();
//     return product.toObject();
// }

const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("brandId").populate("categoryId");
        if (!products) {
            return res.status(404).json({ error: "product not found" })
        }
        res.status(200).json(products);
    } catch (err) {
        console.error("error Fetching product:", err);
        return res.status(500).json({
            error: "An error occurred to get the product"
        })

    }
}
const getProduct = async (req, res) => {
    try {
        let id = req.params.id;
        const product = await Product.findById(id).populate("brandId").populate("categoryId");
        if (!product) {
            return res.status(404).json({ error: "product not found" })
        }
        return res.status(200).json(product);
    } catch (err) {
        console.error("error Fetching product:", err);
        return res.status(500).json({
            error: "An error occurred to get the product"
        })

    }
}
const updateProduct = async (req, res) => {
    try {
        let id = req.params.id;
        let images = [];
        if (req.files?.length) {
            const uploaded = req.files.map(file => '/images/' + file.filename);
            images.push(...uploaded);
        }
        const existing = req.body.images;
        if (existing) {
            const urls = Array.isArray(existing) ? existing : [existing];
            urls.forEach(url => {
                if (typeof url === 'string' && !url.startsWith('[object File]')) {
                    images.push(url);
                }
            });
        }
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { ...req.body, images },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        return res.status(201).json({
            success: true,
            message: "Product update successfully",
            product: updatedProduct
        });
    } catch (err) {
        console.error("error Fetching product:", err);
        return res.status(500).json({
            error: "An error occurred to update the product"
        })

    }
}
const deleteProduct = async (req, res) => {
    try {
        let id = req.params.id;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            res.status(404).json({ error: "product not found" })
        }
        return res.status(201).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (err) {
        console.error("error Fetching product:", err);
        return res.status(500).json({
            error: "An error occurred to delete the product"
        })

    }
}
const getNewProducts = async (req, res) => {
    try {
        const product = await Product.find({ isNewProduct: true }).populate("brandId").populate("categoryId");
        if (!product) {
            res.status(404).json({ error: "New products not found" })
        }
        return res.status(200).json(product);
    } catch (err) {
        console.error("Error to find new arrival products:", err);
        return res.status(500).json({
            error: "Error to find new arrival products"
        })
    }
}

const getFeaturedProducts = async (req, res) => {
    try {
        const product = await Product.find({ isFeatured: true }).populate("brandId").populate("categoryId");
        if (!product) {
            res.status(404).json({ error: "Featured not found" })
        }
        // console.log(product);
        return res.status(200).json(product);
    } catch (err) {
        console.error("Error to find featured products:", err);
        return res.status(500).json({
            error: "Error to find featured products"
        })
    }
}

const getProductList = async (req, res) => {
    try {
        let queryParameter = {};
        const {
            searchTerm = '',
            categoryId,
            brandId,
            sortBy = 'price',
            sortOrder = 1,
            page = 1,
            pageSize = 10
        } = req.query;



        if (searchTerm) {
            queryParameter.$or = [
                { name: { $regex: searchTerm, $options: "i" } },
                { shortDescription: { $regex: searchTerm, $options: "i" } },
            ];
        }
        if (categoryId) queryParameter.categoryId = categoryId;
        if (brandId) queryParameter.brandId = brandId;

        const validSortFields = ["price", "name", "createdAt"];
        const sortField = validSortFields.includes(sortBy) ? sortBy : "price";
        const sortDirection = Number(sortOrder) === -1 ? -1 : 1;
        const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
        const pageSizeNumber = Math.max(parseInt(pageSize, 10) || 10, 1);

        const skip = (pageNumber - 1) * pageSizeNumber;
        const limit = pageSizeNumber;

        const products = await Product.find(queryParameter)
            .sort({ [sortField]: sortDirection })
            .skip(skip)
            .limit(limit)
            .populate("categoryId")
            .populate("brandId");

        return res.status(200).json(
            products
        );

        if (!products.length) {
            return res.status(404).json({ error: "No products found" });
        }



    } catch (err) {
        console.error("Error finding products:", err);
        return res.status(500).json({ error: "Error finding products" });
    }
};

// const getProductDisplay = async (req, res) => {
//     try {
//         let id = req.params.id;
//         let product = await Product.findById(id);
//         return res.status(200).json(product);
//     } catch { err } {
//         console.error("Error finding product:", err);
//         return res.status(500).json({ error: "Error finding product" });
//     }

// };

export { addProduct, getProducts, getProduct, updateProduct, deleteProduct, getFeaturedProducts, getProductList, getNewProducts }