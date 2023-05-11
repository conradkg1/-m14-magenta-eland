const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({ include: Product });
    res.status(200).json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, { include: Product });
    if (!tag) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }
    res.status(200).json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const tag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!tag[0]) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }
    res.status(200).json({ message: 'Tag updated!' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(200).json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});



router.delete('/:id', async (req, res) => {
  try {
    const tag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!tag) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }
    res.status(200).json({ message: 'Tag deleted!' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;