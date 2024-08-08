import { MongoClient } from 'mongodb';

const url = 'mongodb+srv://Jitender:jitender1234@cluster0.ymayb.mongodb.net'; // Replace with your MongoDB URI

let db;

export async function connectDB() {
    if (db) return db; // Return existing connection if already connected

    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        console.log('MongoDB connected');
        db = client.db("experience");
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1);
    }
}

export function getDB() {
    if (!db) {
        throw new Error('Database not initialized. Call connectDB() first.');
    }
    return db;
}
