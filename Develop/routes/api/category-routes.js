const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const categoryInfo = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categoryInfo);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const categoryID = req.params.id;
    const categoryInfo = await Category.findByPk(categoryID,
      {
        include: [{ model: Product }],

      });

    if (!categoryInfo) {
      return res.status(400).json(
        { message: `No category found.` }
      );
    }
    res.status(200).json(categoryInfo);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const category = await Category.create(req.body);

    if (category) {
      res.status(200).json(category);
    } else {
      res.status(500).json({
        message: 'create category failed.',
        data: req.body
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const categoryID = req.params.id;
    const category = await Category.update(req.body, {
      where: {
        id: categoryID
      },
    });

    if (!category[0]) {
      return res.status(404).json({ message: `Cannot find correct category.` });
    }

    res.status(200).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

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