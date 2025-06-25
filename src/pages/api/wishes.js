// src/pages/api/wishes.js
import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';

const wishesFilePath = path.join(process.cwd(), 'src', 'data', 'wishes.json');

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const data = fs.readFileSync(wishesFilePath, 'utf8');
            const wishes = JSON.parse(data);
            res.status(200).json(wishes);
        } catch (error) {
            console.error('Error reading wishes file:', error);
            // If file doesn't exist or is empty, return an empty array
            if (error.code === 'ENOENT' || error.name === 'SyntaxError') {
                return res.status(200).json([]);
            }
            res.status(500).json({ message: 'Failed to load wishes.' });
        }
    } else if (req.method === 'POST') {
        const { name, message, attending } = req.body;

        if (!name || !message || !attending) {
            return res.status(400).json({ message: 'Name, message, and attendance are required.' });
        }

        try {
            let wishes = [];
            try {
                const data = fs.readFileSync(wishesFilePath, 'utf8');
                wishes = JSON.parse(data);
            } catch (readError) {
                // If file doesn't exist or is empty, start with an empty array
                if (readError.code !== 'ENOENT' && readError.name !== 'SyntaxError') {
                    console.error('Error reading wishes file before POST:', readError);
                    return res.status(500).json({ message: 'Failed to read existing wishes.' });
                }
            }

            const newWish = {
                id: nanoid(), // Generate a unique ID
                name,
                message,
                attending, // Ensure this field matches the new `attending` state
                timestamp: new Date().toISOString(),
            };

            // Add new wish to the beginning of the array
            wishes.unshift(newWish);

            fs.writeFileSync(wishesFilePath, JSON.stringify(wishes, null, 2), 'utf8');
            res.status(201).json(newWish);
        } catch (error) {
            console.error('Error writing wish to file:', error);
            res.status(500).json({ message: 'Failed to submit wish.' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}