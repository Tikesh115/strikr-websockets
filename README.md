# Strikr WebSockets

**Strikr** is a real-time live scoring web application for sports, powered by WebSockets. Built with React, Express.js, and PostgreSQL, it enables instant score updates and live match tracking.

## 🚀 Features

- **Real-time Updates**: WebSocket-powered live score broadcasting
- **RESTful API**: Express.js backend for match management
- **Database**: PostgreSQL with Drizzle ORM for data persistence
- **Security**: Arcjet integration for rate limiting, bot detection, and shield protection
- **Validation**: Zod schema validation for data integrity
- **Pub/Sub Pattern**: Efficient real-time communication

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **WebSocket**: ws library
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Security**: Arcjet (Shield, Rate Limiting, Bot Detection)
- **Validation**: Zod
- **Frontend**: React (separate repository)

## 📦 Installation

1. **Clone the repository**  
   ```bash
   git clone https://github.com/Tikesh115/strikr-websockets.git
   cd strikr-websockets
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Set up environment variables**  
   
   Create a `.env` file in the root directory:  
   ```env
   DATABASE_URL=your_postgresql_connection_string
   ARCJET_KEY=your_arcjet_api_key
   ARCJET_MODE=LIVE # or DRY_RUN for testing
   PORT=8000
   HOST=0.0.0.0
   ```

4. **Run database migrations**  
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

## 🚀 Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### CRUD Example
```bash
npm run crud:example
```

The server will start on `http://localhost:8000` and the WebSocket server on `ws://localhost:8000/ws`

## 📜 Available Scripts

- `npm run dev` - Start the server in development mode with auto-reload
- `npm start` - Start the server in production mode
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run crud:example` - Run CRUD operation examples

## 🔒 Security Features

Strikr uses **Arcjet** for comprehensive security:

- **Shield Protection**: Protects against common attacks
- **Bot Detection**: Allows search engines and preview bots, blocks malicious bots
- **Rate Limiting**:
  - HTTP endpoints: 50 requests per 10 seconds
  - WebSocket connections: 5 requests per 2 seconds

## 🌐 API Endpoints

### Matches
- `GET /matches` - Retrieve all matches
- `POST /matches` - Create a new match
- `GET /matches/:id` - Get a specific match
- `PUT /matches/:id` - Update match details
- `DELETE /matches/:id` - Delete a match

## 🗄️ Database

Strikr uses **PostgreSQL** as the primary database with **Drizzle ORM** for type-safe database operations.

Database configuration is managed through `drizzle.config.js` and migrations are stored in the `/drizzle` directory.

## 📁 Project Structure

```
strikr-websockets/
├── src/
│   ├── index.js          # Main server entry point
│   ├── arcjet.js         # Security middleware configuration
│   ├── crud-example.js   # Database CRUD examples
│   ├── db/               # Database connection and schemas
│   ├── routes/           # API route handlers
│   └── ws/               # WebSocket server setup
├── drizzle/              # Database migrations
├── package.json
├── drizzle.config.js
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Tikesh115**

- GitHub: [@Tikesh115](https://github.com/Tikesh115)

## 🙏 Acknowledgments

- Built with Express.js and WebSocket technology
- Secured with Arcjet
- Database management with Drizzle ORM

---

⚡ **Strikr** - Real-time sports scoring made simple!