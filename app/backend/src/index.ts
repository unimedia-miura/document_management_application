import express, { Request, Response } from "express";
import router from "./server/router";

const app = express();
const port = 3000;
app.use(express.json());
app.use('/api', router);

// CORSの設定
app.use((req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(port, () => {
    console.log(`test app listening on port ${port}`)
});