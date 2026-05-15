import {drizzle} from 'drizzle-orm/neon-http'
import {neon} from "@neondatabase/serverless"
import * as schema from './schema'

/*Conexão Neon */
const sql = neon(process.env.DATABASE_URL!);

/*Conexão Docker */
const sqlDocker = process.env.DATABASE_URL!

    export const db = drizzle(sql, {schema});