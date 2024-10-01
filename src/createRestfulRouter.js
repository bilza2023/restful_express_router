const express = require('express');

// Function that takes a Mongoose model and returns a router
function createRestfulRouter(model) {
  debugger;
  const router = express.Router();

  // GET: List all items with sorting, pagination, and filtering
  router.get('/', async (req, res) => {
    try {
      const { sort = '-_id', limit = 10, page = 1, ...filters } = req.query;
      const query = model.find(filters)
                         .sort(sort)
                         .limit(Number(limit))
                         .skip(Number(limit) * (Number(page) - 1));
      const data = await query;
      const total = await model.countDocuments(filters);

      res.status(200).json({ data, total, page: Number(page), limit: Number(limit) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET: Fetch a single item by ID
  router.get('/:id', async (req, res) => {
    try {
      const item = await model.findById(req.params.id);
      if (!item) return res.status(404).json({ error: 'Item not found' });
      res.status(200).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST: Create a new item
  router.post('/', async (req, res) => {
    try {
      const newItem = new model(req.body);
      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // PUT: Update an item by ID
  router.put('/:id', async (req, res) => {
    try {
      const updatedItem = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedItem) return res.status(404).json({ error: 'Item not found' });
      res.status(200).json(updatedItem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE: Remove an item by ID
  router.delete('/:id', async (req, res) => {
    try {
      const deletedItem = await model.findByIdAndDelete(req.params.id);
      if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
      res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

module.exports = createRestfulRouter;
