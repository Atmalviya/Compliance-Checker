# Compliance Checker for Supabase

A comprehensive tool to monitor and manage security compliance settings for your Supabase project. This application helps track Multi-Factor Authentication (MFA), Row Level Security (RLS), and Point-in-Time Recovery (PITR) configurations.

## Features

- 🔐 **MFA Status Check**: Monitor user adoption of Multi-Factor Authentication
- 🛡️ **RLS Status**: Check and enable Row Level Security for database tables
- 💾 **PITR Status**: Verify Point-in-Time Recovery configuration
- 📝 **Compliance Logging**: Automatic logging of all compliance checks
- 🔄 **Auto-Fix Capabilities**: Automated remediation for certain compliance issues

## Tech Stack

- **Frontend**: Next.js 15+, React 19, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: Supabase
- **Authentication**: Supabase Auth

## Prerequisites

- Node.js 18+ and npm
- A Supabase project
- Supabase CLI (optional)

## Environment Setup

### Backend (.env)
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_PROJECT_ID=your_project_id
SUPABASE_ACCESS_TOKEN=your_access_token
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Frontend (.env)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/compliance-checker.git
cd compliance-checker
```

2. Install Backend Dependencies:
```bash
cd backend
npm install
```

3. Install Frontend Dependencies:
```bash
cd frontend
npm install
```

## Running the Application

1. Start the Backend Server:
```bash
cd backend
npm run dev
```

2. Start the Frontend Development Server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Database Setup

1. Create required tables in your Supabase project:

```sql
-- Compliance Logs Table
create table compliance_logs (
  id uuid default uuid_generate_v4() primary key,
  check_type text not null,
  status boolean not null,
  details jsonb,
  timestamp timestamptz default now()
);

-- Access Tokens Table
create table access_tokens (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  expiry timestamptz not null,
  last_used timestamptz,
  usage_count int default 0,
  created_at timestamptz default now()
);

-- Enable RLS Function
create or replace function enable_rls(table_name text)
returns void as $$
begin
  execute format('alter table %I enable row level security;', table_name);
end;
$$ language plpgsql security definer;

-- Get RLS Status Function
create or replace function get_rls_status()
returns table (table_name text, rls_enabled boolean) as $$
begin
  return query
  select 
    tables.table_name::text,
    tables.rls_enabled
  from 
    pg_tables
    join (
      select 
        table_name,
        has_table_privilege(table_name, 'SELECT') as selectable,
        obj_description(quote_ident(table_name)::regclass, 'pg_class') as description,
        case 
          when exists (
            select 1 from pg_class c
            where c.relname = tables.table_name
            and c.relrowsecurity = true
          ) then true
          else false
        end as rls_enabled
      from pg_tables tables
      where schemaname = 'public'
    ) tables on true
  where 
    tables.selectable = true
  order by 
    tables.table_name;
end;
$$ language plpgsql security definer;
```

## API Endpoints

### MFA Status
- `GET /api/check-mfa`
  - Checks MFA status for all users
  - Returns user list with MFA status

### RLS Status
- `GET /api/check-rls`
  - Checks RLS status for all tables
  - Returns table list with RLS status

### PITR Status
- `GET /api/check-pitr`
  - Checks Point-in-Time Recovery configuration
  - Returns PITR status and configuration details

### Token Management
- `GET /api/check-tokens`
  - Verifies access token status
  - Returns token list with expiry and usage info

### Auto-Fix
- `POST /api/auto-fix`
  - Applies automated fixes
  - Request body:
    ```json
    {
      "fixType": "ENABLE_RLS",
      "resourceId": "table_name"
    }
    ```

### Evidence Logging
- `POST /api/log-evidence`
  - Logs compliance checks
  - Request body:
    ```json
    {
      "checkType": "CHECK_TYPE",
      "status": boolean,
      "details": object
    }
    ```

## Development

### Project Structure
```
compliance-checker/
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── page.js
│   ├── services/
│   │   └── api.js
│   └── package.json
├── backend/
│   ├── routes/
│   ├── lib/
│   ├── middleware/
│   ├── config/
│   └── server.js
└── README.md
```

### Key Components

1. Frontend Components:
   - MFACheck: Monitors MFA adoption
   - RLSCheck: Manages RLS configuration
   - PITRCheck: Verifies backup settings
   - AutoFix: Handles automated remediation

2. Backend Services:
   - Authentication checks
   - Database security verification
   - Automated fixes
   - Evidence logging
