import { Product } from "./product.model.js";
import { ProductSchemaType, ProductUpdateSchemaType } from "./product.validation.js";


// Handle Add Product
const addProduct = async (payload: ProductSchemaType) => {
  const {title, price, stock, userId, description}= payload;

  // check existing product
  const isProductExist = await Product.findOne({
      title,
      adminId: userId,
  }).lean();

  if(isProductExist){
    throw new Error("Product already exist!")
  }

  // Add the product
  const result = await Product.create({
      title,
      price,
      stock,
      adminId: userId,
      description,
  });
  return result;
};

// Find all products
const getAllProducts = async (_payload: any) => {
  const result = await Product.find()
    .sort({ createdAt: -1 })
    // .limit(2)
    .lean();
  return result;
};

// Get one product
const getOneProduct = async (payload: string) => {
  const result = await Product.findById(payload).lean();

  return result;
};

// handle update product
const updateProduct = async (payload: {id: string, data:ProductUpdateSchemaType}) => {
  const {id, data}= payload;
  const {title, price, stock, description, userId}= data;

  const result = await Product.findOneAndUpdate(
    {
      _id: id,
      adminId: userId,
    },
    {
      title,
      price,
      stock,
      description,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!result) {
    throw new Error("Product does not exist!");
  }

  return result;
};

// Handle Delete Product
const deleteProduct = async (payload: string) => {

  // delete the product
  const result = await Product.findByIdAndDelete(payload);

  if (!result) {
    throw new Error("Product does not exist!");
  }

  return result;
};

export const ProductService = {
  addProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
};
