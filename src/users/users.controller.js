import services from './users.service.js';

export function getAll(req, res) {
  res.json(services.getAll());
}

export default {
  getAll,
};