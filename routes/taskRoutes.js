const express = require('express');
const router = express.Router();

const {getAllTasks,
    addTask,
    updateTask,
    deleteTask} = require('../controllers/taskControllers')



router.route('/').get(getAllTasks);
router.route('/appendTask').post(addTask);
router.route('/modifyTask').patch(updateTask);
router.route('/delete/:id').delete(deleteTask);

module.exports = router;