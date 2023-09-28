// MongoDB-Sequelize-Manage-Database-Function-Operations
const Tables = require("../dbAssociation");

const addNewProduct = async (productData) => {
  const { productName, productDesc, productPrice, productImg, adminId } =
    productData;
  
  const newProduct = new Tables.ProductTable({
    productName,
    productDesc,
    productPrice: parseInt(productPrice),
    productImg,
    adminId,
  });

  newProduct.createProduct();

  
  // await Tables.ProductTable.createOrUpdateProduct(newProduct, (isNew = true));
};

const getAllProducts = async () => {
  const allProducts = Tables.ProductTable.findAllProducts();

  return allProducts;
};

const getOneProduct = async (productId) => {
  const foundProduct = await Tables.ProductTable.getSingleProduct(productId);

  return foundProduct;
};

const updateOneProduct = async (updatedData) => {
  await Tables.ProductTable.updateProduct(updatedData);
};

const deleteOneProduct = async (productId) => {
  await Tables.ProductTable.deleteProduct(productId);
};

module.exports = {
  addNewProduct,
  getAllProducts,
  getOneProduct,
  updateOneProduct,
  deleteOneProduct,
};
