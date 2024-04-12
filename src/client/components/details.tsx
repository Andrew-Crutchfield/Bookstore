import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GET } from '../services/fetcher';

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  categoryid: number;
}

interface Category {
  id: number;
  name: string;
}

const BookDetails: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksResponse = await GET<{ books: Book[] }>('/api/books');
        setBooks(booksResponse.books);

        const categoriesResponse = await GET<{ categories: Category[] }>('/api/categories');
        setCategories(categoriesResponse.categories);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  const hasToken = localStorage.getItem('token');

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  return (
    <div>
      <h1>All Books</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {books.map((book) => (
            <div key={book.id}>
              <h2>{book.title}</h2>
              <p>Author: {book.author}</p>
              <p>Price: ${book.price}</p>
              <p>Category: {getCategoryName(book.categoryid)}</p>
            </div>
          ))}
        </div>
      )}
      {hasToken && <Link to="/booklisting">Go to Book Listing</Link>}
    </div>
  );
};

export default BookDetails;
