const express = require('express');
const router = express.Router();
const { proteger, adminSeulement } = require('../middleware/auth');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');

// Toutes les routes users nécessitent un token valide + être Admin
router.get('/',       proteger, adminSeulement, getUsers);
router.post('/',      proteger, adminSeulement, createUser);
router.put('/:id',    proteger, adminSeulement, updateUser);
router.delete('/:id', proteger, adminSeulement, deleteUser);

module.exports = router;