import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

interface Book {
    id: number;
    categoryid: number;
    title: string;
    author: string;
    price: string;
    created_at: Date;
}

const booksFilePath = path.join(process.env.JSON_PATH as string, 'books.json');

export const getAllBooks = async (req: Request, res: Response) => {
    try {
        console.log('Fetching all books...');
        const booksData = fs.readFileSync(booksFilePath);
        const books: Book[] = JSON.parse(booksData.toString());
        res.json({ books });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getBookById = async (req: Request, res: Response) => {
    try {
        // Implement getBookById logic here
    } catch (error) {
        console.error('Error fetching book details:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const createBook = async (req: Request, res: Response) => {
    try {
        console.log('Creating a new book...');
        const { categoryid, title, author, price }: Partial<Book> = req.body;
        const booksData = fs.readFileSync(booksFilePath);
        let books: Book[] = JSON.parse(booksData.toString());

        const id = books.length > 0 ? books[books.length - 1].id + 1 : 1;
        const created_at = new Date();

        const newBook: Book = { 
            id, 
            categoryid: categoryid as number,
            title: title || '',
            author: author || '',
            price: (price || '0'),
            created_at 
        };
        
        books.push(newBook);
        fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));

        res.status(201).json({ message: 'Book created successfully', book: newBook });
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateBook = async (req: Request, res: Response) => {
    try {
        console.log('Updating a book...');
        const id: number = parseInt(req.params.id);
        const { categoryid, title, author, price }: Partial<Book> = req.body;
        
        const booksData = fs.readFileSync(booksFilePath);
        let books: Book[] = JSON.parse(booksData.toString());

        const index = books.findIndex((book) => book.id === id);

        if (index === -1) {
            return res.status(404).json({ message: 'Book not found' });
        }

        books[index] = {
            ...books[index],
            categoryid: categoryid !== undefined ? categoryid : books[index].categoryid,
            title: title !== undefined ? title : books[index].title,
            author: author !== undefined ? author : books[index].author,
            price: price !== undefined ? price : books[index].price,
        };

        fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));

        res.json({ message: 'Book updated successfully', book: books[index] });
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteBook = async (req: Request, res: Response) => {
    try {
        console.log('Deleting a book...');
        const id: number = parseInt(req.params.id);

        const booksData = fs.readFileSync(booksFilePath);
        let books: Book[] = JSON.parse(booksData.toString());

        const filteredBooks = books.filter((book) => book.id !== id);

        if (filteredBooks.length === books.length) {
            return res.status(404).json({ message: 'Book not found' });
        }

        fs.writeFileSync(booksFilePath, JSON.stringify(filteredBooks, null, 2));

        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
