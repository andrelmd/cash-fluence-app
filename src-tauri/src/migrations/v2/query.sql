CREATE TABLE IF NOT EXISTS recurrences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    type INTEGER NOT NULL,
    create_date TEXT NOT NULL,
	due_date TEXT NOT NULL,
    category_id INTEGER NOT NULL,
	next_execution_date TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories (id)
);

CREATE TABLE IF NOT EXISTS locks (
    key TEXT NOT NULL PRIMARY KEY,
	expires_at TEXT NOT NULL
);