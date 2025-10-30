import { SqliteAdapter } from "./adapters/sqlite.adpater"
import { DatabaseService } from "./services/database.service"

const database = new DatabaseService(new SqliteAdapter())
database.init().catch((err) => {
	console.error(err)
})

export default database