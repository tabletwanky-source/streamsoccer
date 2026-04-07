# Football Web App - API Documentation

## Base URL
All API endpoints are available at: `http://localhost:3000/api`

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### Register a New User
**POST** `/api/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "is_admin": false
  }
}
```

**Errors:**
- `400`: Email and password are required
- `400`: User already exists
- `500`: Server error

---

### Login
**POST** `/api/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "is_admin": false
  }
}
```

**Errors:**
- `400`: Email and password are required
- `401`: Invalid credentials
- `500`: Server error

---

### Get Current User
**GET** `/api/me`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "is_admin": false,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `401`: Access token required
- `403`: Invalid or expired token
- `404`: User not found
- `500`: Server error

---

## Favorites Endpoints

### Get User Favorites
**GET** `/api/favorites`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "favorites": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "team_id": 86,
      "team_name": "Real Madrid",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Errors:**
- `401`: Access token required
- `403`: Invalid or expired token
- `500`: Server error

---

### Add a Favorite Team
**POST** `/api/favorites`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "team_id": 86,
  "team_name": "Real Madrid"
}
```

**Response (201):**
```json
{
  "favorite": {
    "id": "uuid",
    "user_id": "uuid",
    "team_id": 86,
    "team_name": "Real Madrid",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `400`: team_id and team_name are required
- `401`: Access token required
- `403`: Invalid or expired token
- `500`: Server error

---

### Delete a Favorite
**DELETE** `/api/favorites/:id`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Favorite deleted successfully"
}
```

**Errors:**
- `401`: Access token required
- `403`: Not authorized (trying to delete another user's favorite)
- `404`: Favorite not found
- `500`: Server error

---

## Posts (Blog) Endpoints

### Get All Posts
**GET** `/api/posts`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "posts": [
    {
      "id": "uuid",
      "title": "Match Highlights: Real Madrid vs Barcelona",
      "content": "An exciting match between two rivals...",
      "image": "https://example.com/image.jpg",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Errors:**
- `401`: Access token required
- `403`: Invalid or expired token
- `500`: Server error

---

### Create a New Post (Admin Only)
**POST** `/api/posts`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Match Highlights: Real Madrid vs Barcelona",
  "content": "An exciting match between two rivals...",
  "image": "https://example.com/image.jpg"
}
```

**Response (201):**
```json
{
  "post": {
    "id": "uuid",
    "title": "Match Highlights: Real Madrid vs Barcelona",
    "content": "An exciting match between two rivals...",
    "image": "https://example.com/image.jpg",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `400`: Title and content are required
- `401`: Access token required
- `403`: Admin access required (user is not an admin)
- `500`: Server error

---

### Delete a Post (Admin Only)
**DELETE** `/api/posts/:id`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Post deleted successfully"
}
```

**Errors:**
- `401`: Access token required
- `403`: Admin access required (user is not an admin)
- `500`: Server error

---

## Database Schema

### Users Table
```sql
- id (uuid, primary key)
- email (text, unique)
- password (text, hashed with bcrypt)
- is_admin (boolean, default: false)
- created_at (timestamptz)
```

### Favorites Table
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key -> users.id)
- team_id (integer)
- team_name (text)
- created_at (timestamptz)
```

### Posts Table
```sql
- id (uuid, primary key)
- title (text)
- content (text)
- image (text)
- created_at (timestamptz)
```

---

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt before storage
2. **JWT Authentication**: Tokens expire after 7 days
3. **Row Level Security (RLS)**: Database-level security ensures users can only access their own data
4. **Admin Authorization**: Only admin users can create or delete posts
5. **Input Validation**: All endpoints validate required fields

---

## Example Frontend Usage

### Register and Login
```javascript
// Register
const response = await fetch('http://localhost:3000/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
const { token, user } = await response.json();

// Store token for future requests
localStorage.setItem('token', token);
```

### Make Authenticated Requests
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3000/api/favorites', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const { favorites } = await response.json();
```

---

## Making a User an Admin

To make a user an admin, you need to update the database directly:

```sql
UPDATE users
SET is_admin = true
WHERE email = 'admin@example.com';
```

You can run this SQL query in the Supabase dashboard or using the Supabase client.
