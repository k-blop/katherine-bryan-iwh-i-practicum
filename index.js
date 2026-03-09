require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const CUSTOM_OBJECT_ID = '2-58175935';
const PROPERTIES = 'name,bean_type,info';

const OBJECT_TYPE = 'coffee'; 

app.get('/', async (req, res) => {
    const customObjectRoute = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}?properties=name,info,bean_type`;
    
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(customObjectRoute, { headers });
        const records = response.data.results;
        
        res.render('homepage', { title: 'Custom Objects | HubSpot Practicum', records });      
    } catch (error) {
        console.error(error);
        res.send('Error loading the homepage.');
    }
});

app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

app.post('/update-cobj', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}`;
    
    const newRecord = {
        properties: {
            "name": req.body.name,
            "info": req.body.info,
            "bean_type": req.body.bean_type
        }
    };

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(updateRoute, newRecord, { headers });
        res.redirect('/');
    } catch (error) {
        console.error("HubSpot Error Details:", error.response ? error.response.data : error.message);
        res.send('Error creating the custom object. Check your terminal!');
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
