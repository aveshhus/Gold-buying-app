# 📁 Database Directory

This directory previously contained JSON database files. The application now uses **MongoDB**.

## Migration

If you have existing JSON data, migrate it to MongoDB:

```bash
npm run migrate
```

Or:

```bash
node scripts/migrate-to-mongodb.js
```

## Current Status

- ✅ **MongoDB** - Active database
- 📦 **JSON files** - Kept for reference/backup only

## Note

The JSON files in this directory are **not used** by the application anymore. They are kept for:
- Reference
- Backup
- Migration purposes

You can safely delete them after successful migration to MongoDB.

