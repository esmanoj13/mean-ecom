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

const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("brandId").populate("categoryId").lean;
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
        });
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
// this function is used for searching products by name, category, and brand
// It supports pagination, sorting, and filtering by category and brand.    
const getProductList = async (req, res) => {
    try {
        const {
            searchTerm = '',
            categoryId,
            brandId,
            sortBy = 'price',
            sortOrder = 1,
            page = 1,
            pageSize = 10
        } = req.query;
        let filter = [];
        // 1.If categoryId or brandId is provided, add them to the 
        // filter to narrow down the search results.
        // 2. This line searches the Category collection to see if the searchTerm typed by 
        // the user matches any category name, case-insensitively.
        if (searchTerm) {
            // Create a case-insensitive regex to search for the term in product name, description, category, and brand.
            // This allows users to search for products by name, short description, category, or brand.
            const $regex = new RegExp(searchTerm, 'i');
            const matchedCategories = await Category.find({ name: $regex }, '_id');
            const matchedBrands = await Brand.find({ name: $regex }, '_id');
            const categoryIds = matchedCategories.map(c => c._id);
            const brandIds = matchedBrands.map(b => b._id);
            filter.push({
                $or: [
                    { name: $regex },
                    { shortDescription: $regex },
                    // $in is a MongoDB query operator used to match values that are inside a given array.
                    { categoryId: { $in: categoryIds } },
                    { brandId: { $in: brandIds } }
                ]
            });
        }
        if (categoryId) filter.push({ categoryId });
        if (brandId) filter.push({ brandId });
        // You're allowing users to search across multiple fields (category, brand, product name, description),
        // and you want to show all matching results, not just those that match all filters.

        const query = filter.length > 0 ? { $and: filter } : {};
        const validSortFields = ["price", "name", "createdAt"];
        const sortField = validSortFields.includes(sortBy) ? sortBy : "price";
        const sortDirection = Number(sortOrder) === -1 ? -1 : 1;
        const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
        const pageSizeNumber = Math.max(parseInt(pageSize, 10) || 10, 1);
        const skip = (pageNumber - 1) * pageSizeNumber;
        const limit = pageSizeNumber;

        const products = await Product.find(query)
            .sort({ [sortField]: sortDirection })
            .skip(skip)
            .limit(limit)
            .populate("categoryId")
            .populate("brandId");

        res.status(200).json(
            products
        );
    } catch (err) {
        console.error("Error finding products:", err);
        return res.status(500).json({ error: "Error finding products" });
    }
};
export { addProduct, getProducts, getProduct, updateProduct, deleteProduct, getFeaturedProducts, getProductList, getNewProducts }