const express = require('express');
const path = require('path');
const fs = require('fs');
const notesDB = require('./db/db.json');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET request for /api/notes
app.get('/api/notes', (req, res) => { 
  fs.readFile('./db/db.json','utf8',(err,data) => {
    if (err) {
      console.error(err);
    } else {
        // Convert string into JSON object
        const parsedReviews = JSON.parse(data);
        res.json(parsedReviews);
        console.log(`this is line 25 ${data}`);
      }
      
});

  
  console.log(notesDB);
});

// GET request for notes
app.get('/notes', (req, res) => {
     
    // Log our request to the terminal
    console.info(`${req.method} request received to get reviews`);

    //return
    res.sendFile(path.join(__dirname, '/public/notes.html'));
  });
 
  


// POST request to add a note
//TOdo make the saved note appear on notes.html
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a review`);
  
    // Destructuring assignment for the items in req.body
    const { title,text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newReview = {
        title,
        text,
        review_id: uuid(),
      };
  
      // Obtain existing reviews
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedReviews = JSON.parse(data);
  
          // Add a new review
          parsedReviews.push(newReview);
  
          // Write updated reviews back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedReviews, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated reviews!')
          );
        }
      });
  
      const response = {
        status: 'success',
        body: newReview,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting review');
    }
  });

//Delete a note
  // app.delete('/api/notes/:note', (req, res) => {

  //   const deleteNote = req.params.note;

  //   if (deleteNote) {
  //     for (let i = 0; i < )
  //   }
  //   res.send('Got a DELETE request at /user')
  // })

// GET request for * all
app.get('*', (req, res) => {
    // Log our request to the terminal
    console.info(`${req.method} request received to get reviews`);

    //return
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () =>
console.log(`App listening at http://localhost:${PORT} 🚀`)
);
