
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
	color TEXT NOT NULL,
	monthly_limit REAL
);

CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    type INTEGER NOT NULL,
    create_date TEXT NOT NULL,
	due_date TEXT NOT NULL,
	payment_date TEXT,
    category_id INTEGER NOT NULL,
	current_installment REAL,
	installments INTEGER,
    FOREIGN KEY (category_id) REFERENCES categories (id)
);