const express = require('express')
const path = require('path')

const app = express()
const port = 3006

const buildpath = '../frontend/build'
app.use(express.static(path.join(__dirname, buildpath)));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, `${buildpath}/index.html`));
});

app.listen(port, () => console.log(`client_gateway is running on port: ${port}`));