
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
	color TEXT NOT NULL,
	monthly_limit REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    type INTEGER NOT NULL,
    create_date TEXT NOT NULL,
    category_id INTEGER NOT NULL,
	current_installment REAL NOT NULL,
	installments INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories (id)
);