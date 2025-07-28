"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const DBConnection_1 = __importDefault(require("./db/DBConnection"));
(0, DBConnection_1.default)().then(result => console.log(result));
dotenv_1.default.config();
const port = process.env.PORT;
app_1.default.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
