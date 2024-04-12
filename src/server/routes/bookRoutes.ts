import express from 'express';
import { getAllBooks, getBookById, createBook, updateBook, deleteBook } from '../controllers/bookController';
import tokenCheck from '../middlewares/tokenCheck';

const router = express.Router();

router.get('/books', getAllBooks);
router.get('/books/:id', getBookById);
router.post('/books', tokenCheck, createBook);
router.put('/books/:id', tokenCheck, updateBook);
router.delete('/books/:id', tokenCheck, deleteBook);

export default router;
