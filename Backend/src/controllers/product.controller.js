import { Product } from "../models/product.model.js";
import getDataUri from "../utils/getDataUri.js";
import cloudinary from "../utils/cloudinary.js";
import { sendEmail } from "../utils/sendEmail.js";
import { User } from "../models/user.model.js";
import { Activity } from "../models/activity.model.js";




export const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, condition } = req.body;

    
    if (!title || !price) {
      return res.status(400).json({
        success: false,
        message: "Title and price are required",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    
    const images = [];
    for (const file of req.files) {
      const fileUri = getDataUri(file);
      const uploadResult = await cloudinary.uploader.upload(fileUri.content, {
        folder: "lost_and_listed/products",
      });
      images.push({
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      });
    }

    const product = await Product.create({
      title,
      description,
      price,
      category,
      condition,
      images,
      seller: req.user._id,
    });

    await Activity.create({
      user: req.user._id,
      item: product._id,
      itemType: "Product",
      activityType: "ITEM_FOR_SALE",
      message: `${req.user.fullName} listed an item: ${product.title} for sale`,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating product",
    });
  }
};




export const getAllProducts = async (req, res) => {
  try {

    const products = await Product.find({ isSold: false })
      .sort({ createdAt: -1 })
      .populate("seller", "username email fullName");

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching products",
    });
  }
};



export const filterProducts = async (req, res) => {
  try {
    const { title ,category, condition, priceMin, priceMax } = req.query;

    const filter = { isSold: false };

    if (category) filter.category = category;
    if (condition) filter.condition = condition;

    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    

    
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .populate("seller", "name email");

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error filtering products:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while filtering products",
    });
  }
};


export const getUserProducts = async (req, res) => {
  try {
    const userId = req.user._id;

    
    const products = await Product.find({ seller: userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching user products:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching user products",
    });
  }
};

export const getRecentProducts = async (req, res) => {
  try {
   
    const recentProducts = await Product.find({ isSold: false })
      .sort({ createdAt: -1 }) 
      .limit(5) 
      .populate("seller", "username fullName email");

    return res.status(200).json({
      success: true,
      count: recentProducts.length,
      products: recentProducts,
    });
  } catch (error) {
    console.error("Error fetching recent products:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching recent products",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate("seller", "username fullName email avatar phone email");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);

    // kind: "ObjectId" → indicates that it failed to cast to a MongoDB ObjectId
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while fetching product",
    });
  }
};



export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { title, description, price, category, condition } = req.body;

    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }


    if (product.seller.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this product",
      });
    }

    
    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (condition) product.condition = condition;

    
    if (req.files && req.files.length > 0) {
      for (const img of product.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }

      const images = [];
      for (const file of req.files) {
        const fileUri = getDataUri(file);
        const uploadResult = await cloudinary.uploader.upload(fileUri.content, {
          folder: "lost_and_listed/products",
        });
        images.push({
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        });
      }

      product.images = images;
    }


    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);

    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while updating product",
    });
  }
};

export const markProductSold = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 2️⃣ Check ownership
    if (product.seller.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to mark this product as sold",
      });
    }

    if (product.isSold) {
      return res.status(409).json({
        success: false,
        message: "Product is already marked as sold",
      });
    }

    product.isSold = true;
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product marked as sold successfully",
      product,
    });
  } catch (error) {
    console.error("Error marking product as sold:", error);

    
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while marking product as sold",
    });
  }
};





export const unmarkProductSold = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id; 


    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }


    if (product.seller.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this product",
      });
    }


    if (!product.isSold) {
      return res.status(409).json({
        success: false,
        message: "Product is already available",
      });
    }

    
    product.isSold = false;
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product is now available for sale",
      product,
    });
  } catch (error) {
    console.error("Error unmarking product as sold:", error);

    
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while updating product status",
    });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id; 

    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    
    if (product.seller.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this product",
      });
    }


    for (const img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }


    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);

    
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while deleting product",
    });
  }
};

