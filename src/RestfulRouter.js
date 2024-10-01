const express = require('express');

class RestfulRouter {
  constructor(model,globalMiddleware=[]) {
    this.model = model;
    this.globalMiddleware = globalMiddleware; 
  }

  getRouter() {
    const router = express.Router();
   
    if (this.globalMiddleware.length > 0) {
      router.use(...this.globalMiddleware); 
    }
    router.get('/', this.listItems.bind(this)); // Bind 'this' context
    router.get('/:id', this.getItemById.bind(this)); // Bind 'this' context
    router.post('/', this.createItem.bind(this)); // Bind 'this' context
    router.put('/:id', this.updateItem.bind(this)); // Bind 'this' context
    router.delete('/:id', this.deleteItem.bind(this)); // Bind 'this' context

    return router;
  }

  async listItems(req, res) {
    try {
      const { sort = '-_id', limit = 10, page = 1,fields, ...filters } = req.query;
      const query = this.model.find(filters)
      .select(fields) 
        .sort(sort)
        .limit(Number(limit))
        .skip(Number(limit) * (Number(page) - 1));
      const data = await query;
      const total = await this.model.countDocuments(filters);

      res.status(200).json({ data, total, page: Number(page), limit: Number(limit) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getItemById(req, res) {
    try {
      const item = await this.model.findById(req.params.id);
      if (!item) return res.status(404).json({ error: 'Item not found' });
      res.status(200).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async createItem(req, res) {
    try {
      const newItem = new this.model(req.body);
      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateItem(req, res) {
    try {
      const updatedItem = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedItem) return res.status(404).json({ error: 'Item not found' });
      res.status(200).json(updatedItem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteItem(req, res) {
    try {
      const deletedItem = await this.model.findByIdAndDelete(req.params.id);
      if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
      res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = RestfulRouter;
