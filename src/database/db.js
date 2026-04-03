const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'bot.sqlite');

// sql.js wrapper that mimics better-sqlite3's synchronous API
class DatabaseWrapper {
    constructor() {
        this.db = null;
        this.ready = false;
        this._initPromise = this._init();
    }

    async _init() {
        try {
            const SQL = await initSqlJs();

            // Load existing database file if it exists
            if (fs.existsSync(dbPath)) {
                const fileBuffer = fs.readFileSync(dbPath);
                this.db = new SQL.Database(fileBuffer);
            } else {
                this.db = new SQL.Database();
            }

            console.log('[Database] SQLite connected successfully.');

            // Create tables if they do not exist
            this.db.run(`
                CREATE TABLE IF NOT EXISTS warnings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    userId TEXT NOT NULL,
                    guildId TEXT NOT NULL,
                    moderatorId TEXT NOT NULL,
                    reason TEXT NOT NULL,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                );
            `);
            this.db.run(`
                CREATE TABLE IF NOT EXISTS tickets (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    channelId TEXT NOT NULL,
                    userId TEXT NOT NULL,
                    guildId TEXT NOT NULL,
                    status TEXT NOT NULL DEFAULT 'open',
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
                );
            `);

            console.log('[Database] Tables verified.');
            this._save();
            this.ready = true;
        } catch (err) {
            console.error('[Database] Failed to initialize:', err);
        }
    }

    _save() {
        if (!this.db) return;
        try {
            const data = this.db.export();
            const buffer = Buffer.from(data);
            fs.writeFileSync(dbPath, buffer);
        } catch (err) {
            console.error('[Database] Save error:', err);
        }
    }

    // Mimic better-sqlite3's prepare().run() / .all() / .get()
    prepare(sql) {
        const self = this;
        return {
            run(...params) {
                if (!self.db) throw new Error('Database not initialized');
                self.db.run(sql, params);
                const info = { changes: self.db.getRowsModified() };
                self._save();
                return info;
            },
            all(...params) {
                if (!self.db) throw new Error('Database not initialized');
                const stmt = self.db.prepare(sql);
                if (params.length > 0) stmt.bind(params);
                const rows = [];
                while (stmt.step()) {
                    rows.push(stmt.getAsObject());
                }
                stmt.free();
                return rows;
            },
            get(...params) {
                if (!self.db) throw new Error('Database not initialized');
                const stmt = self.db.prepare(sql);
                if (params.length > 0) stmt.bind(params);
                let row = undefined;
                if (stmt.step()) {
                    row = stmt.getAsObject();
                }
                stmt.free();
                return row;
            }
        };
    }

    exec(sql) {
        if (!this.db) throw new Error('Database not initialized');
        this.db.run(sql);
        this._save();
    }
}

const db = new DatabaseWrapper();

module.exports = db;
