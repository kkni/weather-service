import express, { Request, Response , Router} from "express";
import weather from './route/weather'

const app = express();
const PORT = process.env.PORT || 1818;

// JSON 미들웨어 사용
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express with NPM   ㅁㄴㅇㄴㅇㅁㄹ!");
});


app.use('/weather', weather)



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});