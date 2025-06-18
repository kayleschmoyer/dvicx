# Backend

Express API written in TypeScript. Provides services for the Digital Vehicle Inspection application.

## Setup

```bash
npm install
npm run dev
```

Environment variables can be configured in `.env`.
Required values:

```
DB_SERVER=your_server
DB_NAME=your_database
DB_USER=your_user
DB_PASSWORD=your_password
DB_PORT=1433
```

### Query Filters

When retrieving work orders for a mechanic, the API now excludes orders with a
status of `4` or `5`. Inspection line items returned for a work order also
exclude items that have been declined (`DECLINED = '0'`).
