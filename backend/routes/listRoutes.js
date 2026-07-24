import express from 'express';
import { getMyLists, createList, updateList, deleteList } from '../controllers/listController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getMyLists)
  .post(protect, createList);

router.route('/:id')
  .put(protect, updateList)
  .delete(protect, deleteList);

export default router;
