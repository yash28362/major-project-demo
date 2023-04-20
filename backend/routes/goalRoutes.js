const express = require('express')
const router = express.Router()
const {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
} = require('../controllers/goalController')

const { protect } = require('../middleware/authMiddleware')
const {verifyRoles} =require('../middleware/authRoleMiddleware')

router.route('/').get([protect,verifyRoles("Consumer")], getGoals).post([protect,verifyRoles("Organizer","Consumer")], setGoal)
router.route('/:id').delete([protect,verifyRoles("Organizer","Consumer")], deleteGoal).put([protect,verifyRoles("Organizer","Consumer")], updateGoal)

module.exports = router
