import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path'; // Import the path module to handle file paths

interface Book {
    id: number;
    categoryid: number; // Change type to number
    title: string;
    author: string;
    price: string;
    created_at: Date;
}



// Use the path.join function to construct the file path
const booksFilePath = path.join(process.env.JSON_PATH as string, 'books.json');

export const getAllBooks = async (req: Request, res: Response) => {
    try {
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
        const { categoryid, title, author, price }: Partial<Book> = req.body;
        const booksData = fs.readFileSync(booksFilePath);
        let books: Book[] = JSON.parse(booksData.toString());

        // Generate a new id (assuming the last book's id + 1)
        const id = books.length > 0 ? books[books.length - 1].id + 1 : 1;
        const created_at = new Date();

        const newBook: Book = { 
            id, 
            categoryid: categoryid as number, // Adjust type casting to number
            title: title || '', // Use an empty string as the default value if title is undefined
            author: author || '', // Use an empty string as the default value if author is undefined
            price: (price || '0'), // Use '0' as the default value if price is undefined
            created_at 
        };
        
        // Add the new book to the array
        books.push(newBook);

        // Write the updated data back to the file
        fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));

        res.status(201).json({ message: 'Book created successfully', book: newBook });
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const updateBook = async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id); // Extract book ID from request parameters
        const { categoryid, title, author, price }: Partial<Book> = req.body;
        
        const booksData = fs.readFileSync(booksFilePath);
        let books: Book[] = JSON.parse(booksData.toString());

        // Find the index of the book to update
        const index = books.findIndex((book) => book.id === id);

        // If the book is not found, return a 404 Not Found response
        if (index === -1) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Update the book with the new data
        books[index] = {
            ...books[index], // Copy existing book properties
            categoryid: categoryid !== undefined ? categoryid : books[index].categoryid, // Update categoryid if provided
            title: title !== undefined ? title : books[index].title, // Update title if provided
            author: author !== undefined ? author : books[index].author, // Update author if provided
            price: price !== undefined ? price : books[index].price, // Update price if provided
        };

        // Write the updated data back to the file
        fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));

        res.json({ message: 'Book updated successfully', book: books[index] });
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const deleteBook = async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id); // Extract book ID from request parameters

        const booksData = fs.readFileSync(booksFilePath);
        let books: Book[] = JSON.parse(booksData.toString());

        // Filter out the book to delete
        const filteredBooks = books.filter((book) => book.id !== id);

        // If the filtered array has the same length as the original array, the book was not found
        if (filteredBooks.length === books.length) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Write the updated data back to the file
        fs.writeFileSync(booksFilePath, JSON.stringify(filteredBooks, null, 2));

        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Implement other book controller methods as needed


// import { Request, Response } from 'express';
// import { ResultSetHeader } from 'mysql2';
// import { query } from '../db/db';
// import { Book } from '../types';

// const getAllBooks = async (req: Request, res: Response) => {
//     try {
//         const sql = 'SELECT * FROM books';
//         const books: Book[] = await query<Book[]>(sql);
//         res.json({ books });
//     } catch (error) {
//         console.error('Error fetching books:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

// const getBookById = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         const sql = 'SELECT * FROM books WHERE id = ?';
//         const books: Book[] = await query<Book[]>(sql, [id]);
//         const book = books[0];
//         if (book) {
//             res.json(book);
//         } else {
//             res.status(404).json({ message: 'Book not found' });
//         }
//     } catch (error) {
//         console.error('Error fetching book details:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

// const createBook = async (req: Request, res: Response) => {
//     try {
//         const { title, author, categoryid, price } = req.body;

//         if (categoryid === undefined) {
//             return res.status(400).json({ message: 'Category ID is required' });
//         }

//         const sql = 'INSERT INTO books (title, author, categoryid, price) VALUES (?, ?, ?, ?)';
//         const result = await query<ResultSetHeader>(sql, [title, author, categoryid, price]);

//         const newBook: Book = {
//             id: result.insertId,
//             title,
//             author,
//             categoryid,
//             price,
//             created_at: new Date()
//         };
//         res.json({ message: 'Book created successfully', book: newBook });
//     } catch (error) {
//         console.error('Error creating book:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

// const updateBook = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         const { title, author, categoryid, price } = req.body;
//         const sql = 'UPDATE books SET title = ?, author = ?, categoryid = ?, price = ? WHERE id = ?';
//         const safePrice = price !== undefined ? price : null;

//         const result = await query<ResultSetHeader>(sql, [title, author, categoryid, safePrice, id]);

//         if (result.affectedRows > 0) {
//             res.json({ message: 'Book updated successfully' });
//         } else {
//             res.status(404).json({ message: 'Book not found' });
//         }
//     } catch (error) {
//         console.error('Error updating book:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

// const deleteBook = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         const sql = 'DELETE FROM books WHERE id = ?';

//         const result = await query<ResultSetHeader>(sql, [id]);

//         if (result.affectedRows > 0) {
//             res.json({ message: 'Book deleted successfully' });
//         } else {
//             res.status(404).json({ message: 'Book not found' });
//         }
//     } catch (error) {
//         console.error('Error deleting book:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

// export { getAllBooks, getBookById, createBook, updateBook, deleteBook };
