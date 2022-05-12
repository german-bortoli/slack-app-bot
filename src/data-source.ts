import { DataSource } from "typeorm"
import { resolve as pathResolve } from 'path'
import { Message } from "./entities/message"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: pathResolve(__dirname, "../data/app.db"),
    synchronize: true,
    entities: [ Message ],
    subscribers: [],
    migrations: [],
    logging: process.env.NODE_ENV === 'develop' ? true : false,
})