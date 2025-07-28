
import dotenv from 'dotenv';
import app from "./app";
import DBConnection from "./db/DBConnection";

DBConnection().then(result => console.log(result));

dotenv.config()



const port = process.env.PORT as string;





app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})