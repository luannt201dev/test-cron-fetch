import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

dotenv.config()

import { MongoClient } from "mongodb";

const url = `mongodb://${process.env.MONGODB_USER || "root"}:${
  process.env.MONGODB_PWD || ""
}@${process.env.MONGODB_HOST || "localhost"}:${
  process.env.MONGODB_PORT || 27017
}/?authSource=admin`;
const client = new MongoClient(url);
client.connect();

const db = client.db(process.env.MONGODB_NAME)

const app = express();
app.use(
	cors({
		origin: '*',
		methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
	})
)
app.use(express.json());
app.use(express.urlencoded());


app.get("/", async (req, res) => {
    try {
        const testCron = await db.collection("test-cron");
        await testCron.insertOne({
            time: new Date().toISOString()
        })
        res.status(201).json({message: "oke"})
    }
    catch (er) {
        console.log(er)
        res.status(500).json({message: "not oke"})

    }
    
})

const PORT = process.env.PORT || 3868

app.listen(PORT, () => console.log(`App running on port ${PORT}`))