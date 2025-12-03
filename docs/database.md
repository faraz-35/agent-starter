# Database & Schema Management

## Schema Design Principles

### 1. Naming Conventions
- **Tables**: Plural, snake_case (e.g., `users`, `user_profiles`, `organization_members`)
- **Columns**: snake_case (e.g., `first_name`, `created_at`, `organization_id`)
- **Indexes**: `idx_table_column` pattern
- **Foreign Keys**: `fk_table_column` pattern
- **Constraints**: `ck_table_condition` pattern

### 2. Primary Keys
- Always use UUID primary keys with `id` column name
- Set default value to `gen_random_uuid()`
- Add primary key constraint

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- other columns
);
```

### 3. Timestamps
- Include `created_at` and `updated_at` on all tables
- Set `created_at` default to `NOW()`
- Use trigger for automatic `updated_at` updates

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
```

### 4. Foreign Key Relationships
- Use descriptive column names (e.g., `organization_id` instead of `org_id`)
- Add proper foreign key constraints
- Consider cascade delete/update rules carefully

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Row Level Security (RLS)

### RLS Policy Patterns

#### 1. Enable RLS
```sql
-- Enable RLS on the table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
```

#### 2. User Access Patterns
```sql
-- Users can see their own posts
CREATE POLICY "Users can view own posts" ON posts
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own posts
CREATE POLICY "Users can insert own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own posts
CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);
```

#### 3. Role-Based Access
```sql
-- Admins can do anything
CREATE POLICY "Admins full access" ON posts
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Organization members can access organization data
CREATE POLICY "Organization members access" ON projects
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
  );
```

#### 4. Complex RLS with Functions
```sql
-- Helper function for organization-based access
CREATE OR REPLACE FUNCTION user_has_organization_access(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organization_members 
    WHERE organization_id = org_id 
    AND user_id = auth.uid()
    AND deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Use in policies
CREATE POLICY "Organization access" ON projects
  FOR ALL USING (
    user_has_organization_access(organization_id)
  );

-- Function for role-based access
CREATE OR REPLACE FUNCTION user_has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.jwt() ->> 'role' = required_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Admin access" ON users
  FOR ALL USING (user_has_role('admin'));
```

### RLS Best Practices

#### 1. Security Functions
```sql
-- Create security functions with SECURITY DEFINER
-- These run with the privileges of the function owner, not the caller
CREATE OR REPLACE FUNCTION can_access_project(project_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user is project owner or organization member
  RETURN EXISTS (
    SELECT 1 FROM projects p
    JOIN organization_members om ON p.organization_id = om.organization_id
    WHERE p.id = project_id 
    AND om.user_id = auth.uid()
    AND om.deleted_at IS NULL
  ) OR EXISTS (
    SELECT 1 FROM project_members 
    WHERE project_id = project_id 
    AND user_id = auth.uid()
    AND deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### 2. Performance Considerations
```sql
-- Add indexes for RLS policy columns
CREATE INDEX idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX idx_organization_members_org_id ON organization_members(organization_id);
CREATE INDEX idx_organization_members_composite ON organization_members(organization_id, user_id, deleted_at);
```

## Migration Strategy

### Migration File Organization
```sql
-- migrations/001_initial_schema.sql
-- migrations/002_add_user_profiles.sql  
-- migrations/003_add_audit_logs.sql
-- migrations/004_add_soft_deletes.sql
```

### Migration Pattern

Each migration includes up and down migrations:

```sql
-- migrations/003_add_audit_logs.sql

-- Up migration
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trigger function
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, user_id)
  VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
    auth.uid()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply trigger to users table
CREATE TRIGGER audit_users_trigger
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

-- Down migration
DROP TRIGGER IF EXISTS audit_users_trigger ON users;
DROP TRIGGER IF EXISTS audit_projects_trigger ON projects;
DROP FUNCTION IF EXISTS audit_trigger();
DROP TABLE IF EXISTS audit_logs;
```

### Migration Commands
```bash
# Create new migration
supabase db new add_user_preferences

# Apply migrations
supabase db push

# View migration status
supabase migration list

# Reset database (dev only)
supabase db reset
```

## Database Performance

### Indexing Strategy

#### 1. Primary Key Indexes (Automatic)
```sql
-- No need to create - PostgreSQL automatically indexes primary keys
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() -- Automatically indexed
);
```

#### 2. Foreign Key Indexes
```sql
-- Create indexes on foreign key columns
CREATE INDEX idx_projects_organization_id ON projects(organization_id);
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
```

#### 3. Query-Specific Indexes
```sql
-- For WHERE clauses
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- For JOIN operations
CREATE INDEX idx_project_members_project_id ON project_members(project_id);
CREATE INDEX idx_project_members_user_id ON project_members(user_id);

-- For ORDER BY clauses
CREATE INDEX idx_activities_created_at_desc ON activities(created_at DESC);
CREATE INDEX idx_users_last_sign_in_at ON users(last_sign_in_at DESC);
```

#### 4. Composite Indexes
```sql
-- For queries filtering on multiple columns
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);
CREATE INDEX idx_organization_members_org_user ON organization_members(organization_id, user_id);
CREATE INDEX idx_posts_author_status_date ON posts(user_id, status, created_at DESC);
```

#### 5. Partial Indexes
```sql
-- Index only active records (with soft deletes)
CREATE INDEX idx_active_users ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_active_projects ON projects(organization_id) WHERE deleted_at IS NULL;

-- Index only specific conditions
CREATE INDEX idx_admin_users ON users(id) WHERE auth.jwt() ->> 'role' = 'admin';
```

### Query Optimization

#### 1. Use Specific Columns
```sql
-- ❌ BAD - Selecting all columns
SELECT * FROM users WHERE organization_id = $1;

-- ✅ GOOD - Selecting specific columns
SELECT id, email, first_name, last_name FROM users WHERE organization_id = $1;
```

#### 2. Limit Results
```sql
-- ❌ BAD - No limit
SELECT * FROM activities ORDER BY created_at DESC;

-- ✅ GOOD - With limit for pagination
SELECT * FROM activities ORDER BY created_at DESC LIMIT 50 OFFSET $1;
```

#### 3. Use CTEs for Complex Queries
```sql
-- ✅ GOOD - Using CTEs
WITH user_projects AS (
  SELECT id, name FROM projects WHERE organization_id = $1
),
project_tasks AS (
  SELECT 
    p.id as project_id,
    p.name as project_name,
    COUNT(t.id) as task_count
  FROM user_projects p
  LEFT JOIN tasks t ON t.project_id = p.id
  GROUP BY p.id, p.name
)
SELECT * FROM project_tasks;
```

## Database Functions and Views

### Database Functions

#### 1. CRUD Operations
```sql
-- Create function with input validation
CREATE OR REPLACE FUNCTION create_project(
  project_name TEXT,
  org_id UUID,
  user_id UUID
)
RETURNS UUID AS $$
DECLARE
  project_id UUID;
BEGIN
  -- Validate inputs
  IF project_name IS NULL OR length(trim(project_name)) = 0 THEN
    RAISE EXCEPTION 'Project name cannot be empty';
  END IF;
  
  -- Check user permissions
  IF NOT user_has_organization_access(org_id) THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;
  
  -- Create project
  INSERT INTO projects (name, organization_id, created_by)
  VALUES (project_name, org_id, user_id)
  RETURNING id INTO project_id;
  
  RETURN project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### 2. Data Aggregation Functions
```sql
-- Get organization statistics
CREATE OR REPLACE FUNCTION get_organization_stats(org_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM users WHERE organization_id = org_id AND deleted_at IS NULL),
    'total_projects', (SELECT COUNT(*) FROM projects WHERE organization_id = org_id AND deleted_at IS NULL),
    'active_projects', (SELECT COUNT(*) FROM projects WHERE organization_id = org_id AND status = 'active' AND deleted_at IS NULL),
    'total_tasks', (SELECT COUNT(*) FROM tasks WHERE project_id IN (SELECT id FROM projects WHERE organization_id = org_id))
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Database Views

#### 1. User-Friendly Views
```sql
-- View for user profiles with organization info
CREATE OR REPLACE VIEW user_profiles_view AS
SELECT 
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  u.avatar_url,
  o.name as organization_name,
  o.id as organization_id,
  u.created_at,
  u.last_sign_in_at
FROM users u
JOIN organization_members om ON u.id = om.user_id AND om.deleted_at IS NULL
JOIN organizations o ON om.organization_id = o.id
WHERE u.deleted_at IS NULL;
```

#### 2. Aggregated Views
```sql
-- View for project statistics
CREATE OR REPLACE VIEW project_stats_view AS
SELECT 
  p.id,
  p.name,
  p.status,
  p.created_at,
  COUNT(t.id) as total_tasks,
  COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
  COUNT(CASE WHEN t.due_date < NOW() AND t.status != 'completed' THEN 1 END) as overdue_tasks
FROM projects p
LEFT JOIN tasks t ON t.project_id = p.id AND t.deleted_at IS NULL
WHERE p.deleted_at IS NULL
GROUP BY p.id, p.name, p.status, p.created_at;
```

## Soft Deletes

### Implementation Pattern
```sql
-- Add soft delete columns
ALTER TABLE projects ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE projects ADD COLUMN deleted_by UUID REFERENCES users(id);

-- Update all foreign key references
CREATE INDEX idx_projects_deleted_at ON projects(deleted_at);

-- RLS policies for soft deletes
CREATE POLICY "Active projects access" ON projects
  FOR ALL USING (deleted_at IS NULL);

-- Function for soft delete
CREATE OR REPLACE FUNCTION soft_delete_project(project_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE projects 
  SET deleted_at = NOW(), deleted_by = auth.uid()
  WHERE id = project_id AND deleted_at IS NULL;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Audit and Logging

### Audit Trail
```sql
-- Comprehensive audit table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  old_values JSONB,
  new_values JSONB,
  user_id UUID REFERENCES users(id),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for audit queries
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
```

### Session Management
```sql
-- User sessions table for tracking
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  session_token TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);
```

## Database Backup and Recovery

### Backup Strategy
```bash
# Manual backup
supabase db dump --data-only -f backup_$(date +%Y%m%d).sql

# Backup specific tables
supabase db dump --data-only --table=users --table=projects -f partial_backup.sql

# Include schema
supabase db dump --schema=public -f full_backup.sql
```

### Recovery Procedures
```bash
# Restore from backup
supabase db reset
supabase db push backup_20241203.sql

# Point-in-time recovery (if enabled)
supabase db restore --timestamp="2024-12-03T10:30:00Z"
```

## Database Monitoring

### Performance Monitoring
```sql
-- Slow query log (enable in postgresql.conf)
log_min_duration_statement = 1000  # Log queries taking > 1 second

-- Monitor active connections
SELECT 
  pid,
  usename,
  application_name,
  state,
  query_start,
  state_change
FROM pg_stat_activity 
WHERE state = 'active';

-- Monitor table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Index Usage Analysis
```sql
-- Find unused indexes
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE idx_scan = 0
ORDER BY schemaname, tablename;
```

This comprehensive database documentation provides the patterns and best practices needed for building scalable, secure, and performant database solutions within the Next.js production starter template.