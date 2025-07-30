const createError = require('http-errors');
const express = require('express');
const multer = require('multer');
const Database = require('better-sqlite3');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');

const app = express();

// Setup SQLite DB
const db = new Database(path.join(__dirname, 'logs.db'));
db.exec(`
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT,
    vehicleId TEXT,
    type TEXT,
    code TEXT,
    message TEXT
  );
`);

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// Multer for file upload
const upload = multer({ dest: 'uploads/' });

function parseLogLine(line) {
  const match = line.match(
    /\[(.*?)\] \[VEHICLE_ID:(\d+)\] \[(.*?)\] \[CODE:(.*?)\] \[(.*?)\]/
  );
  if (!match) return null;
  const [_, timestamp, vehicleId, type, code, message] = match;
  return {
    timestamp,
    vehicleId,
    type,
    code,
    message,
  };
}

// Upload route
app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = req.file?.path;
  if (!filePath) return res.status(400).json({ error: 'No file uploaded' });

  const logs = fs
    .readFileSync(filePath, 'utf-8')
    .split('\n')
    .map(parseLogLine)
    .filter(Boolean);

  const insert = db.prepare(`
    INSERT INTO logs (timestamp, vehicleId, type, code, message)
    VALUES (@timestamp, @vehicleId, @type, @code, @message)
  `);

  const insertMany = db.transaction((logs) => {
    for (const log of logs) insert.run(log);
  });

  insertMany(logs);
  fs.unlinkSync(filePath);

  res.json({ message: 'File uploaded successfully', data: logs });
});

// GET /logs with filters
app.get('/logs', (req, res) => {
  const { vehicle, code, from, to } = req.query;
  let query = 'SELECT * FROM logs WHERE 1=1';
  const params = [];

  if (vehicle) {
    query += ' AND vehicleId = ?';
    params.push(vehicle);
  }
  if (code) {
    query += ' AND code = ?';
    params.push(code);
  }
  if (from) {
    query += ' AND timestamp >= ?';
    params.push(from);
  }
  if (to) {
    query += ' AND timestamp <= ?';
    params.push(to);
  }

  const logs = db.prepare(query).all(...params);
  res.json({ message: 'success', data: logs });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
