const multer = require('multer');
const mysql = require('mysql');
const path = require('path');
const videos = require('./videos');

// Set up MySQL connection
const connection = mysql.createConnection({
    host: 'localhost:3306',
    user: 'root',
    password: 'Abc#12345',
    database: 'MEDIAPLAYER',
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

// Configure Multer for file upload
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      const filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
      cb(null, filename);
    },
  });

const upload = multer({ storage });



 

// Set up your routes
app.post('/upload', upload.single('video'), (req, res) => {
    const { title } = req.body;
    const filepath = req.file.path;
  
    // Insert file information into the database
    const sql = `INSERT INTO VIDEO_TABLE (videoID, isPlaying, videoURL, dateAndTime) VALUES (${req.file.index},false,${filepath},${new Date()})`;
    db.query(sql, [title, filepath], (err, result) => {
      if (err) throw err;
      console.log('File information inserted into the database.');
    });
  
    res.send('File uploaded successfully.');
  });
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  
  

