-- Recreate transactions table without NOT NULL on category_id
CREATE TABLE transactions_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    type INTEGER NOT NULL,
    create_date TEXT NOT NULL,
    due_date TEXT NOT NULL,
    payment_date TEXT,
    category_id INTEGER,
    current_installment REAL,
    installments INTEGER,
    installment_code TEXT,
    payment_method TEXT,
    FOREIGN KEY (category_id) REFERENCES categories (id)
);

INSERT INTO transactions_new SELECT * FROM transactions;
DROP TABLE transactions;
ALTER TABLE transactions_new RENAME TO transactions;

-- Recreate recurrences table without NOT NULL on category_id
CREATE TABLE recurrences_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    type INTEGER NOT NULL,
    create_date TEXT NOT NULL,
    due_date TEXT NOT NULL,
    category_id INTEGER,
    next_execution_date TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories (id)
);

INSERT INTO recurrences_new SELECT * FROM recurrences;
DROP TABLE recurrences;
ALTER TABLE recurrences_new RENAME TO recurrences;

-- Create recurrence_categories table
CREATE TABLE IF NOT EXISTS recurrence_categories (
    recurrence_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (recurrence_id, category_id),
    FOREIGN KEY (recurrence_id) REFERENCES recurrences (id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
);

-- Migrate existing recurrence categories
INSERT INTO recurrence_categories (recurrence_id, category_id)
SELECT id, category_id FROM recurrences WHERE category_id IS NOT NULL;

-- Create transaction_categories table
CREATE TABLE IF NOT EXISTS transaction_categories (
    transaction_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (transaction_id, category_id),
    FOREIGN KEY (transaction_id) REFERENCES transactions (id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
);

-- Migrate existing transaction categories
INSERT INTO transaction_categories (transaction_id, category_id)
SELECT id, category_id FROM transactions WHERE category_id IS NOT NULL;