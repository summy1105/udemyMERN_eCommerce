import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

// @desc    Fetch all products
// @route   Get /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res)=> {
  const pageSize = 2;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword ? { name : {
    $regex:req.query.keyword,
    $options:"i"
  }} : {};

  const count = await Product.countDocuments({...keyword});
  const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page -1));

  res.json( {products, page, pages:Math.ceil(count/pageSize)});
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

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const userId = req.user._id

  const { rating, comment } = req.body;

  const product = await Product.findById(productId);

  if (product) {
    const alreadyReviewed = product.reviews.find(r=>r.user.toString() === userId.toString());
    
    if(alreadyReviewed){
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: userId,
    }

    product.reviews.push(review);
    
    product.numReviews = product.reviews.length;
    product.rating  = product.reviews.reduce((acc, item)=>item.rating + acc, 0)/product.numReviews;

    await product.save();
    res.status(201).json({message: "Review added"});

  } else {
    res.status(404);
    throw new Error("Product not found");
  }
})