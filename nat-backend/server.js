const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const natRoutes = require('./routes/nat');

dotenv.config();

const app = express()
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());


// ROUTES

app.get('/', (req, res) => {
    res.json({
        message: 'NAT CRUD API is running',
        endpoints: {
            health: '/health',
            getAllrecords: '/api/nat',
            getSingleRecord: '/api/nat/:id',
            createRecord: 'POST /api/nat',
            updateRecord: 'PUT /api/nat/:id',
            deleteRecord: 'DELETE /api/nat/:id'
        }
    });
});

app.use('/api/nat', natRoutes);

// HEALTH CHECK
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});