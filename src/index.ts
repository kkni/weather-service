import express, { Request, Response , Router} from "express";
import weather from './route/weather'
import {initCacheServer} from "./CacheConnector"
const app = express();
const PORT = process.env.PORT || 1818;

import dotenv from 'dotenv';

dotenv.config()

// JSON 미들웨어 사용
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express with NPM   ㅁㄴㅇㄴㅇㅁㄹ!");
});

app.use('/weather', weather)

initCacheServer()

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});