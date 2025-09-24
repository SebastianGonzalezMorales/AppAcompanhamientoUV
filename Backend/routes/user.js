const express = require('express');
const { getUserData, getAllUsers, updateUser, deleteUser, testUser } = require('../controllers/users/user');
const userFromToken  = require('../middlewares/userFromToken')

const router = express.Router();

router.post('/userdata', getUserData);
router.get('/get-all-user', getAllUsers);
router.post('/update-user', updateUser);
router.delete('/delete-user/:id', deleteUser);
router.get('/test-user', userFromToken, testUser);


module.exports = router;
