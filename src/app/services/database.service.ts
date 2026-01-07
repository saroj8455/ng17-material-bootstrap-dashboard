import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private dbName = 'contacts_db';

  constructor() {
    // this.init();
  }

  async init() {
    try {
      console.log('🔄 [SQLite] Initializing Database Service...');

      // 1. Create Connection (Native Mode)
      // We check if a connection already exists to prevent errors on hot-reload
      const isConn = (await this.sqlite.isConnection(this.dbName, false))
        .result;

      if (isConn) {
        this.db = await this.sqlite.retrieveConnection(this.dbName, false);
        console.log('✅ [SQLite] Retrieved existing connection');
      } else {
        this.db = await this.sqlite.createConnection(
          this.dbName,
          false,
          'no-encryption',
          1,
          false
        );
        console.log('✅ [SQLite] New connection created');
      }

      // 2. Open Database
      await this.db.open();
      console.log(`✅ [SQLite] Database '${this.dbName}' opened successfully`);

      // 3. Create Table Schema
      const schema = `
        CREATE TABLE IF NOT EXISTS contacts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          fullName TEXT NOT NULL,
          mobile TEXT NOT NULL
        );
      `;

      await this.db.execute(schema);
      console.log('✅ [SQLite] Table "contacts" verified/created');
    } catch (error) {
      console.error('❌ [SQLite] Initialization Error:', error);
    }
  }

  async initializeDB() {
    // 1. Guard: If already initialized, stop here.
    if (this.db) {
      console.log('⚡ [SQLite] Database already initialized');
      return;
    }

    try {
      console.log('🔄 [SQLite] Starting Initialization...');

      // 2. Check/Create Connection
      const isConn = (await this.sqlite.isConnection(this.dbName, false))
        .result;

      if (isConn) {
        this.db = await this.sqlite.retrieveConnection(this.dbName, false);
      } else {
        this.db = await this.sqlite.createConnection(
          this.dbName,
          false,
          'no-encryption',
          1,
          false
        );
      }

      // 3. Open and Create Table
      await this.db.open();
      const schema = `
        CREATE TABLE IF NOT EXISTS contacts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          fullName TEXT NOT NULL,
          mobile TEXT NOT NULL
        );
      `;
      await this.db.execute(schema);

      console.log('✅ [SQLite] Initialization Complete. Table Ready.');
    } catch (error) {
      console.error('❌ [SQLite] Init Error:', error);
    }
  }

  // --- CRUD OPERATIONS ---

  async addContact(fullName: string, mobile: string) {
    if (!this.db) {
      console.error('⚠️ [SQLite] Database not initialized yet');
      return [];
    }

    try {
      const query = `INSERT INTO contacts (fullName, mobile) VALUES (?, ?)`;
      await this.db.run(query, [fullName, mobile]);
      console.log(`💾 [SQLite] Saved contact: ${fullName}`);

      return this.getContacts(); // Return updated list
    } catch (error) {
      console.error('❌ [SQLite] Error saving contact:', error);
      return [];
    }
  }

  async getContacts() {
    if (!this.db) return [];

    try {
      const res = await this.db.query(
        `SELECT * FROM contacts ORDER BY id DESC`
      );
      // console.log(`📂 [SQLite] Loaded ${res.values?.length} contacts`);
      return res.values || [];
    } catch (error) {
      console.error('❌ [SQLite] Error fetching contacts:', error);
      return [];
    }
  }

  async deleteContact(id: number) {
    if (!this.db) return [];

    try {
      await this.db.run(`DELETE FROM contacts WHERE id = ?`, [id]);
      console.log(`🗑️ [SQLite] Deleted contact ID: ${id}`);
      return this.getContacts();
    } catch (error) {
      console.error('❌ [SQLite] Error deleting contact:', error);
      return [];
    }
  }
}
