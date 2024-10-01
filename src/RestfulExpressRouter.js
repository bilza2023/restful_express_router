const express = require('express');

class RestfulExpressRouter {
  constructor(model) {
    this.model = model;
    
    // Middleware for each route, default to an empty array if not provided
    this.middlewareForList    = [];
    this.middlewareForGetById = [];
    this.middlewareForCreate  = [];
    this.middlewareForUpdate  = [];
    this.middlewareForDelete  = [];
    this.extraRoutes = [];
  }

  // Method to add extra routes
  addExtraRoute(route) {
    this.extraRoutes.push(route);
  }

  getRouter() {
    const router = express.Router();

    // Attach routes with specific middleware arrays
    router.get('/', ...this.middlewareForList, this.listItems.bind(this)); 
    router.get('/:id', ...this.middlewareForGetById, this.getItemById.bind(this)); 
    router.post('/', ...this.middlewareForCreate, this.createItem.bind(this)); 
    router.put('/:id', ...this.middlewareForUpdate, this.updateItem.bind(this)); 
    router.delete('/:id', ...this.middlewareForDelete, this.deleteItem.bind(this)); 

    // Attach additional routes
    this.extraRoutes.forEach(route => {
      const { method, path, middlewares, handler } = route;
      router[method](path, ...middlewares, handler.bind(this));
    });
    
    return router;
  }

  // Controller methods remain the same
  async listItems(req, res) {
    try {
      const { sort = '-_id', limit = 10, page = 1, fields, ...filters } = req.query;
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

module.exports = RestfulExpressRouter;
