import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../data/devstats.db');

let db: Database.Database | null = null;

/**
 * Initialize database connection and create tables
 */
export function initDatabase(): Database.Database {
  // Create data directory if it doesn't exist
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Connect to database
  db = new Database(DB_PATH, { verbose: console.log });

  console.log(`📦 Database connected: ${DB_PATH}`);

  // Create tables
  createTables();

  return db;
}

/**
 * Get database instance
 */
export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * Create database tables
 */
function createTables(): void {
  if (!db) return;

  // Commits table
  db.exec(`
    CREATE TABLE IF NOT EXISTS commits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sha TEXT UNIQUE NOT NULL,
      message TEXT,
      author TEXT,
      committed_at TEXT,
      repo TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Pull requests table
  db.exec(`
    CREATE TABLE IF NOT EXISTS pull_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pr_number INTEGER,
      title TEXT,
      state TEXT,
      created_at TEXT,
      merged_at TEXT,
      closed_at TEXT,
      repo TEXT,
      author TEXT,
      UNIQUE(repo, pr_number)
    )
  `);

  // Reviews table
  db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pr_number INTEGER,
      reviewer TEXT,
      state TEXT,
      submitted_at TEXT,
      repo TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create indexes for performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_commits_repo ON commits(repo);
    CREATE INDEX IF NOT EXISTS idx_commits_committed_at ON commits(committed_at);
    CREATE INDEX IF NOT EXISTS idx_prs_repo ON pull_requests(repo);
    CREATE INDEX IF NOT EXISTS idx_prs_state ON pull_requests(state);
    CREATE INDEX IF NOT EXISTS idx_reviews_repo ON reviews(repo);
  `);

  console.log('✅ Database tables created successfully');
}

/**
 * Close database connection
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    console.log('📦 Database connection closed');
  }
}
