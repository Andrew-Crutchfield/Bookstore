import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path'; // Import the path module to handle file paths

interface Category {
    id: number;
    name: string;
}

// Use the path.join function to construct the file path
const categoriesFilePath = path.join(process.env.JSON_PATH as string, 'categories.json');

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categoriesData = fs.readFileSync(categoriesFilePath);
        const categories: Category[] = JSON.parse(categoriesData.toString());
        res.json({ categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        // Implement getCategoryById logic here
    } catch (error) {
        console.error('Error fetching category details:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Implement other category controller methods as needed


// import { Request, Response } from 'express';
// import { query } from '../db/db';

// export const getAllCategories = async (req: Request, res: Response) => {
//   try {
//     const sql = 'SELECT * FROM categories';
//     const categories = await query(sql);
//     res.json({ categories });
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };
