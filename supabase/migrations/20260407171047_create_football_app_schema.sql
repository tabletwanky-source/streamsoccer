/*
  # Football Web App Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Auto-generated unique identifier
      - `email` (text, unique) - User's email address
      - `password` (text) - Hashed password
      - `is_admin` (boolean) - Admin flag for post management
      - `created_at` (timestamptz) - Account creation timestamp
    
    - `favorites`
      - `id` (uuid, primary key) - Auto-generated unique identifier
      - `user_id` (uuid, foreign key) - References users.id
      - `team_id` (integer) - External team ID
      - `team_name` (text) - Name of the football team
      - `created_at` (timestamptz) - Favorite creation timestamp
    
    - `posts`
      - `id` (uuid, primary key) - Auto-generated unique identifier
      - `title` (text) - Post title
      - `content` (text) - Post content/body
      - `image` (text) - Image URL
      - `created_at` (timestamptz) - Post creation timestamp

  2. Security
    - Enable RLS on all tables
    - Users table: Users can only read their own data
    - Favorites table: Users can manage their own favorites
    - Posts table: Public read access, admin-only write access

  3. Important Notes
    - All tables use UUID for primary keys
    - Timestamps default to current time
    - Foreign key constraints ensure data integrity
    - RLS policies enforce security at the database level
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team_id integer NOT NULL,
  team_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  image text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for favorites table
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for posts table
CREATE POLICY "Anyone can view posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

CREATE POLICY "Admins can delete posts"
  ON posts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON favorites(user_id);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);