const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');
// get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category },
        { model: Tag }
      ]
    });
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to retrieve products' });
  }
});

// Get one product by id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category },
        { model: Tag }
      ]
    });
    if (!product) {
      res.status(404).json({ message: 'No product found with this id' });
      return;
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to retrieve product' });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return { product_id: product.id, tag_id };
      });
      const productTags = await ProductTag.bulkCreate(productTagIdArr);
      res.status(200).json(productTags);
    } else {
      res.status(200).json(product);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to create product' });
  }
});

// Update a product by id
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    const productTags = await ProductTag.findAll({
      where: { product_id: req.params.id }
    });
    const productTagIds = productTags.map(({ tag_id }) => tag_id);
    const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id
        };
      });
    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);
    await Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags)
    ]);
    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to update product' });
  }
});

// Delete a product by id
router.delete('/:id', async (req, res) => {
  try {
    const categoryID = req.params.id;
    const categoryInfo = await Category.destroy({
      where: { id: categoryID },
    });

    if (!categoryInfo) {
      return res.status(404).json({ message: `no category` });
    }

    res.status(200).json(categoryInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});
module.exports = router;