const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

function add(a, b) {
    return a + b;
}

app.post('/rpc', (req, res) => {
    const { jsonrpc, method, params, id } = req.body;

    if (jsonrpc !== '2.0' || !method || !Array.isArray(params)) {
        res.status(400).json({ jsonrpc: '2.0', error: { code: -32600, message: 'Invalid Request' }, id });
        return;
    }

    let result;
    switch (method) {
        case 'add':
            result = add(params[0], params[1]);
            break;
        default:
            res.status(404).json({ jsonrpc: '2.0', error: { code: -32601, message: 'Method not found ' }, id });
            return;
    }
    res.json({ jsonrpc: '2.0', result, id });
});

app.listen(port, () => {
    console.log(`JSON-RPC server listening at http://localhost:${port}`);
});