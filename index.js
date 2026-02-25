const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this either here or anywhere else.
// * Use a .env file instead.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// IMPORTANT: Replace this with your actual custom object ID or type name (e.g., 'coffee' or 'p1234567_coffee')
// If using a standard object, just use 'contacts'
const OBJECT_TYPE = 'coffee'; 

// ROUTE 1: GET Homepage
app.get('/', async (req, res) => {
    // Get all custom properties we need
    const customObjectRoute = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}?properties=name,info,bean_type`;
    
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(customObjectRoute, { headers });
        const records = response.data.results;
        
        // Pass the data to the pug template
        res.render('homepage', { title: 'Custom Objects | HubSpot Practicum', records });      
    } catch (error) {
        console.error('Error getting objects:', error.message);
        res.send('There was an error loading the homepage.');
    }
});

// ROUTE 2: GET Update Form
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// ROUTE 3: POST Update Form
app.post('/update-cobj', async (req, res) => {
    const updateRoute = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`;
    
    // Grab the data from the form
    const newRecord = {
        properties: {
            "name": req.body.name,
            "bio": req.body.info,
            "animal_type": req.body.bean_type
        }
    };

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(updateRoute, newRecord, { headers });
        // Redirect back to homepage after successful creation
        res.redirect('/');
    } catch (error) {
        console.error('Error creating object:', error.message);
        res.send('There was an error creating the custom object.');
    }
});

// Localhost server
app.listen(3000, () => console.log('Listening on http://localhost:3000'));