-- =====================================================================
-- Finance Tracker — full Supabase setup (run once in SQL Editor)
-- Matches server/prisma/schema.prisma exactly (final state of all 5 migrations)
-- Safe to re-run: uses IF NOT EXISTS / ON CONFLICT / CREATE OR REPLACE.
-- =====================================================================

-- ---------- TABLES ----------
CREATE TABLE IF NOT EXISTS "User" (
  "id"                  TEXT NOT NULL,
  "email"               TEXT NOT NULL,
  "createdAt"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "username"            TEXT NOT NULL,
  "monthlyContribution" DECIMAL(65,30) NOT NULL DEFAULT 0,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key"    ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username");

CREATE TABLE IF NOT EXISTS "Account" (
  "id"       TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "userId"   TEXT NOT NULL,
  "name"     TEXT NOT NULL,
  "currency" TEXT NOT NULL,
  "balance"  DECIMAL(65,30) NOT NULL DEFAULT 0,
  CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Category" (
  "id"   TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SavingsCategory" (
  "id"   TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  CONSTRAINT "SavingsCategory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Transaction" (
  "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "userId"      TEXT NOT NULL,
  "accountId"   TEXT NOT NULL,
  "categoryId"  TEXT,
  "amount"      DECIMAL(65,30) NOT NULL,
  "type"        TEXT NOT NULL,
  "merchant"    TEXT,
  "description" TEXT,
  "date"        TIMESTAMP(3) NOT NULL,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Transaction_type_check" CHECK ("type" IN ('income','expense'))
);

CREATE TABLE IF NOT EXISTS "Subscription" (
  "id"              TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "userId"          TEXT NOT NULL,
  "name"            TEXT NOT NULL,
  "amount"          DECIMAL(65,30) NOT NULL,
  "currency"        TEXT NOT NULL,
  "billingCycle"    TEXT NOT NULL,
  "nextPaymentDate" TIMESTAMP(3) NOT NULL,
  "status"          TEXT NOT NULL,
  CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Budget" (
  "id"         TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "userId"     TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "amount"     DECIMAL(65,30) NOT NULL,
  "month"      INTEGER NOT NULL,
  "year"       INTEGER NOT NULL,
  CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SavingsGoal" (
  "id"         TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "userId"     TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "name"       TEXT NOT NULL,
  "target"     DECIMAL(65,30) NOT NULL,
  "current"    DECIMAL(65,30) NOT NULL DEFAULT 0,
  "deadline"   TIMESTAMP(3),
  CONSTRAINT "SavingsGoal_pkey" PRIMARY KEY ("id")
);

-- ---------- FOREIGN KEYS (same as Prisma) ----------
DO $$ BEGIN
  ALTER TABLE "Account"     ADD CONSTRAINT "Account_userId_fkey"        FOREIGN KEY ("userId")     REFERENCES "User"("id")     ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey"    FOREIGN KEY ("userId")     REFERENCES "User"("id")     ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId")  REFERENCES "Account"("id")  ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey"  FOREIGN KEY ("userId")     REFERENCES "User"("id")     ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "Budget"      ADD CONSTRAINT "Budget_userId_fkey"         FOREIGN KEY ("userId")     REFERENCES "User"("id")     ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "Budget"      ADD CONSTRAINT "Budget_categoryId_fkey"     FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "SavingsGoal" ADD CONSTRAINT "SavingsGoal_userId_fkey"    FOREIGN KEY ("userId")     REFERENCES "User"("id")     ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "SavingsGoal" ADD CONSTRAINT "SavingsGoal_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "SavingsCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- INDEXES ----------
CREATE INDEX IF NOT EXISTS "Account_userId_idx"      ON "Account"("userId");
CREATE INDEX IF NOT EXISTS "Transaction_userId_date_idx" ON "Transaction"("userId","date" DESC);
CREATE INDEX IF NOT EXISTS "Transaction_accountId_idx"   ON "Transaction"("accountId");
CREATE INDEX IF NOT EXISTS "SavingsGoal_userId_idx"  ON "SavingsGoal"("userId");
CREATE INDEX IF NOT EXISTS "Budget_userId_idx"       ON "Budget"("userId");
CREATE INDEX IF NOT EXISTS "Subscription_userId_idx" ON "Subscription"("userId");

-- ---------- SEED DATA ----------
-- The frontend (NewGoalForm.tsx) hardcodes these savings category IDs "1".."14".
INSERT INTO "SavingsCategory" ("id","name") VALUES
  ('1','Business'),('2','Car'),('3','Education'),('4','Emergency'),('5','Family'),
  ('6','Health'),('7','Home'),('8','Investment'),('9','Leisure'),('10','Long term'),
  ('11','Major purchase'),('12','Other'),('13','Short term'),('14','Travel')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Category" ("id","name","type") VALUES
  ('cat_salary','Salary','income'),
  ('cat_freelance','Freelance','income'),
  ('cat_investments','Investments','income'),
  ('cat_gifts_in','Gifts','income'),
  ('cat_other_income','Other income','income'),
  ('cat_groceries','Groceries','expense'),
  ('cat_rent','Rent & utilities','expense'),
  ('cat_transport','Transport','expense'),
  ('cat_dining','Dining out','expense'),
  ('cat_shopping','Shopping','expense'),
  ('cat_entertainment','Entertainment','expense'),
  ('cat_health','Health','expense'),
  ('cat_education','Education','expense'),
  ('cat_travel','Travel','expense'),
  ('cat_subscriptions','Subscriptions','expense'),
  ('cat_other_expense','Other expense','expense')
ON CONFLICT ("id") DO NOTHING;

-- ---------- SIGN-UP TRIGGER ----------
-- Creates the "User" profile row (+ a default account) whenever someone signs up
-- through Supabase Auth. Without this, the app has no user row and nothing works.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uname TEXT;
BEGIN
  uname := COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'username'), ''),
                    split_part(NEW.email, '@', 1));

  -- username must be unique: add a short suffix on collision
  IF EXISTS (SELECT 1 FROM "User" WHERE "username" = uname) THEN
    uname := uname || '_' || substr(NEW.id::text, 1, 4);
  END IF;

  INSERT INTO "User" ("id","email","username")
  VALUES (NEW.id::text, NEW.email, uname)
  ON CONFLICT ("id") DO NOTHING;

  INSERT INTO "Account" ("userId","name","currency","balance")
  VALUES (NEW.id::text, 'Main account', 'EUR', 0);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- "User"."id" is TEXT and auth.users.id is UUID, so a foreign key is impossible.
-- This trigger gives the same cleanup: deleting an auth user removes their data.
CREATE OR REPLACE FUNCTION public.handle_deleted_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM "User" WHERE "id" = OLD.id::text;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_deleted_user();

-- Backfill: users that signed up BEFORE this script ran
INSERT INTO "User" ("id","email","username")
SELECT u.id::text, u.email,
       COALESCE(NULLIF(TRIM(u.raw_user_meta_data->>'username'), ''), split_part(u.email,'@',1) || '_' || substr(u.id::text,1,4))
FROM auth.users u
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Account" ("userId","name","currency","balance")
SELECT u."id", 'Main account', 'EUR', 0 FROM "User" u
WHERE NOT EXISTS (SELECT 1 FROM "Account" a WHERE a."userId" = u."id");

-- ---------- ROW LEVEL SECURITY ----------
-- Supabase exposes every public table through its REST API using your public key,
-- so RLS must be on. The Express server connects as the postgres role and
-- bypasses RLS, so the app keeps working.
ALTER TABLE "User"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Transaction"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Budget"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SavingsGoal"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SavingsCategory" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own profile read"   ON "User";
DROP POLICY IF EXISTS "own profile update" ON "User";
CREATE POLICY "own profile read"   ON "User" FOR SELECT TO authenticated USING ("id" = auth.uid()::text);
CREATE POLICY "own profile update" ON "User" FOR UPDATE TO authenticated USING ("id" = auth.uid()::text) WITH CHECK ("id" = auth.uid()::text);

DROP POLICY IF EXISTS "own rows" ON "Account";
DROP POLICY IF EXISTS "own rows" ON "Transaction";
DROP POLICY IF EXISTS "own rows" ON "Subscription";
DROP POLICY IF EXISTS "own rows" ON "Budget";
DROP POLICY IF EXISTS "own rows" ON "SavingsGoal";
CREATE POLICY "own rows" ON "Account"      FOR ALL TO authenticated USING ("userId" = auth.uid()::text) WITH CHECK ("userId" = auth.uid()::text);
CREATE POLICY "own rows" ON "Transaction"  FOR ALL TO authenticated USING ("userId" = auth.uid()::text) WITH CHECK ("userId" = auth.uid()::text);
CREATE POLICY "own rows" ON "Subscription" FOR ALL TO authenticated USING ("userId" = auth.uid()::text) WITH CHECK ("userId" = auth.uid()::text);
CREATE POLICY "own rows" ON "Budget"       FOR ALL TO authenticated USING ("userId" = auth.uid()::text) WITH CHECK ("userId" = auth.uid()::text);
CREATE POLICY "own rows" ON "SavingsGoal"  FOR ALL TO authenticated USING ("userId" = auth.uid()::text) WITH CHECK ("userId" = auth.uid()::text);

DROP POLICY IF EXISTS "read categories"         ON "Category";
DROP POLICY IF EXISTS "read savings categories" ON "SavingsCategory";
CREATE POLICY "read categories"         ON "Category"        FOR SELECT TO authenticated USING (true);
CREATE POLICY "read savings categories" ON "SavingsCategory" FOR SELECT TO authenticated USING (true);
