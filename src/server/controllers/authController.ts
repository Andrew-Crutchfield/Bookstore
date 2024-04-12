import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

interface User {
    id: number;
    email: string;
    password: string;
    role: string;
    created_at: Date;
}

dotenv.config();

const jsonPath = process.env.JSON_PATH;
if (!jsonPath) {
    throw new Error("JSON_PATH environment variable is not set.");
}

export const authenticateUser = async (email: string, password: string): Promise<{ success: boolean; user?: User }> => {
    try {
        console.log('Authenticating user...');
        const usersData = fs.readFileSync(path.join(jsonPath, 'users.json'));
        console.log('Users data:', usersData.toString());
        const users: any[] = JSON.parse(usersData.toString());

        const user = users.find(user => user.email === email);

        if (!user || !user.password) {
            console.log('User not found or password not set');
            return { success: false, user: undefined };
        }

        user.created_at = new Date(user.created_at);

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            console.log('Authentication successful');
            return { success: true, user };
        } else {
            console.log('Incorrect password');
            return { success: false, user: undefined };
        }
    } catch (error) {
        console.error('Error authenticating user', error);
        return { success: false, user: undefined };
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        console.debug('Login request received');
        const { email, password } = req.body;
        console.debug('Email:', email);
        console.debug('Password:', password);
        const authenticationResult = await authenticateUser(email, password);
        console.debug(authenticationResult);

        if (authenticationResult.success) {
            const token: string = jwt.sign(
                { email, role: authenticationResult.user?.role },
                process.env.JWT_SECRET as string,
                { expiresIn: process.env.JWT_EXPIRATION }
            );
            console.debug('Authentication successful. Token:', token);
            res.json({ token });
        } else {
            console.error('Authentication failed');
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login failed', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const registerUser = async (req: Request, res: Response) => {
    try {
        console.log('Registration request received');
        const { email, password } = req.body;
        console.log('Email:', email);
        console.log('Password:', password);
        const hashedPassword = await bcrypt.hash(password, 10);

        const usersData = fs.readFileSync(path.join(jsonPath, 'users.json'));
        console.log('Users data:', usersData.toString());
        const users: User[] = JSON.parse(usersData.toString());

        const newUser: User = {
            id: users.length + 1,
            email,
            password: hashedPassword,
            role: 'user',
            created_at: new Date() // Use a Date object directly
        };

        users.push(newUser);

        fs.writeFileSync(path.join(jsonPath, 'users.json'), JSON.stringify(users, null, 2));
        console.log('User registered successfully');
        
        const token: string = jwt.sign({ email }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRATION });
        console.log('Authentication successful. Token:', token);
        res.json({ token });
    } catch (error) {
        console.error('Registration failed', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



// import { Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
// import config from '../config/config';
// import { query } from '../db/db';

// interface User {
//   id: number;
//   email: string;
//   password: string;
//   role: string;
//   created_at: Date;
// }
// export const authenticateUser = async (email: string, password: string): Promise<{ success: boolean; user?: User }> => {
//     try {
//         const [results] = await query<User[]>('SELECT id, email, password, role, created_at FROM Users WHERE email = ?', [email]);

//         if (!results || (Array.isArray(results) && results.length === 0)) {
//             return { success: false, user: undefined };
//         }

//         const user = Array.isArray(results) ? results[0] : results;

//         if (!user || !user.password) {
//             return { success: false, user: undefined };
//         }

//         const passwordMatch = await bcrypt.compare(password, user.password);

//         if (passwordMatch) {
//             return { success: true, user };
//         } else {
//             return { success: false, user: undefined };
//         }
//     } catch (error) {
//         console.error('Error authenticating user', error);
//         return { success: false, user: undefined };
//     }
// };

// export const loginUser = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const authenticationResult = await authenticateUser(email, password);

//     if (authenticationResult.success) {
//       const token: string = jwt.sign(
//         { email, role: authenticationResult.user?.role },
//         config.jwt.secret,
//         { expiresIn: config.jwt.expiration }
//       );
//       res.json({ token });
//     } else {
//       res.status(401).json({ message: 'Invalid email or password' });
//     }
//   } catch (error) {
//     console.error('Login failed', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// export const registerUser = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const queryResult: { affectedRows?: number } = await query(
//       'INSERT INTO Users (email, password, role, created_at) VALUES (?, ?, ?, ?)',
//       [email, hashedPassword, 'user', new Date()]
//     );

//     if (queryResult.affectedRows && queryResult.affectedRows > 0) {
//       const token: string = jwt.sign({ email }, config.jwt.secret, { expiresIn: config.jwt.expiration });
//       res.json({ token });
//     } else {
//       res.status(400).json({ message: 'Failed to register' });
//     }
//   } catch (error) {
//     console.error('Registration failed', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
