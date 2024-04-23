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

