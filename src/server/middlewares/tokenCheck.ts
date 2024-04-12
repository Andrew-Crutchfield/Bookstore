import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { Payload } from '../types/index';

const tokenCheck = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const tokenSecret: Secret = process.env.JWT_SECRET as Secret;

    try {
        const decoded = jwt.verify(token, tokenSecret) as Payload;
        req.user = decoded;

        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: "Insufficient privileges" });
        }

        next();
    } catch (err) {
        console.error(err);
        return res.status(403).json({ message: "Failed to authenticate token" });
    }
};

export default tokenCheck;
