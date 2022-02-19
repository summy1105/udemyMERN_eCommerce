import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

// @desc    Fetch all products
// @route   Get /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res)=> {
  const product = await Product.find({});

  res.json(product);
})


// @desc    Fetch single product
// @route   Get /api/products/:id
// @access  Public
export const getProductById =  asyncHandler(async (req, res) => {
  // objectID의 일정한 format기준이 정해져 있어서
  // 그 기준을 벗어난 값을 넣어주면 database error가 발생
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if(product){
    await product.remove();
    res.json({message: "Product removed"});
  }else{
    res.status(404);
    throw new Error("Product not found");
  }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  const product = new Product({
    name : 'name',
    price: 0,
    user,
    image: "/images/react.png",
    brand: "brand",
    category: "category",
    countInStock: 0,
    numReviews:0,
    description: "description",
  })
  
  const createdProduct = await product.save();
  if (createdProduct) {
    res.status(200).json(createdProduct);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const { name, price, description, image, brand, category, countInStock } = req.body;

  const product = await Product.findById(productId);

  if (product) {
    {
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.brand = brand;
      product.category = category;
      product.countInStock = countInStock;
    }

    const updatedProduct = await product.save();

    if (updatedProduct) {
      res.json(updatedProduct);
    }
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
})