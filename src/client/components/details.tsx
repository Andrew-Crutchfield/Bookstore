import React, { useState, useEffect } from 'react';
import { fetchData } from '../services/fetcher';
import { Link } from 'react-router-dom';


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
    fetchData().then(data => {
      setBooks(data.booksData);
      setCategories(data.categoriesData);
      setLoading(false);
    }).catch(error => {
      console.error('Error fetching data', error);
      setLoading(false);
    });
  }, []);

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  return (
    <div>
      <h1>Book Listing</h1>
      <Link to="/booklisting">Go to Book Details</Link>
      <h1>All Books</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        books.length > 0 ? (
          <div>
            {books.map(book => (
              <div key={book.id}>
                <h2>{book.title}</h2>
                <p>Author: {book.author}</p>
                <p>Price: ${book.price}</p>
                <p>Category: {getCategoryName(book.categoryid)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No books found.</p>
        )
      )}
    </div>
  );
};

export default BookDetails;