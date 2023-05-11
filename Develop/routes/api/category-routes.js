const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// Get all categories and their associated products
router.get('/', async (req, res) => {
  try {
    const categoryInfo = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categoryInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Get a specific category by ID and its associated products
router.get('/:id', async (req, res) => {
  try {
    const categoryID = req.params.id;
    const categoryInfo = await Category.findByPk(categoryID, {
      include: [{ model: Product }],
    });

    if (!categoryInfo) {
      return res.status(400).json({ message: `No category found.` });
    }

    res.status(200).json(categoryInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Create a new category
router.post('/', async (req, res) => {
  try {
    const category = await Category.create(req.body);

    if (category) {
      res.status(200).json(category);
    } else {
      res.status(500).json({
        message: 'Create category failed.',
        data: req.body,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Update an existing category by ID
router.put('/:id', async (req, res) => {
  try {
    const categoryID = req.params.id;
    const [numUpdated, updatedCategory] = await Category.update(req.body, {
      where: {
        id: categoryID,
      },
      returning: true, // Returns the updated category object
    });

    if (numUpdated === 0) {
      return res.status(404).json({ message: `Cannot find category with ID ${categoryID}` });
    }

    res.status(200).json(updatedCategory[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Delete a category by ID
router.delete('/:id', async (req, res) => {
  try {
    const categoryID = req.params.id;
    const numDeleted = await Category.destroy({
      where: { id: categoryID },
    });

    if (numDeleted === 0) {
      return res.status(404).json({ message: `Cannot find category with ID ${categoryID}` });
    }

    res.status(200).json({ message: `Category with ID ${categoryID} deleted successfully.` });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


module.exports = router;