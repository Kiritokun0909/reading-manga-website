// src/app/controllers/AdminController.js
const roleService = require('../services/RoleService.js');

class AdminController {
    // [GET] /roles
    async getRoles(req, res) {
        try{
          const result = await roleService.getRoles();
          res.status(200).json(result);
        } catch(err) {
          console.log('Failed to get list roles:', err);
          res.status(500).json({ message: 'Failed to get list roles. Please try again later.' });
        }
    }

}

module.exports = new AdminController;