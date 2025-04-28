const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/resolve', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ success: false, message: 'URL is required' });
    }

    try {
        // Request the short link and follow redirects manually
        const response = await axios.get(url, {
            maxRedirects: 0,
            validateStatus: (status) => status >= 200 && status < 400
        });

        const realUrl = response.headers.location;

        if (realUrl) {
            return res.json({ success: true, expandedUrl: realUrl });
        } else {
            return res.json({ success: false, message: 'No redirect found.' });
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: 'Failed to resolve URL.' });
    }
});

app.get('/', (req, res) => {
    res.send('TikTok Resolver API is Running 🚀');
});

app.listen(PORT, () => {
    console.log(`Resolver server running on port ${PORT}`);
});
