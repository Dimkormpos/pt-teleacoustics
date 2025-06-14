const functions = require('firebase-functions');
import { Request, Response } from 'express';
import express from 'express';
import axios, { AxiosRequestConfig } from 'axios';



const app = express();
const client = axios.create({
    baseURL: 'http://telematics.oasa.gr',
});

console.log("REVERSE PROXY STARTED with client base URL:", client.defaults.baseURL);

app.use('/', (req: Request, res: Response) => {
    console.log("trying to proxy request with req:", req.originalUrl, "and method:", req.method);


    const config: AxiosRequestConfig = {
        method: req.method,
        url: 'http://telematics.oasa.gr' + req.originalUrl, // Use originalUrl to preserve the path
        headers: req.headers,
        data: req.body,
    };
    console.log("and configuration", config);

    client.request(config).then((response) => {
        console.log("REVERSE PROXY RESPONSE:", response.data);

        response.headers['access-control-allow-origin'] = '*'; // Set CORS header
        response.headers['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, OPTIONS'; // Allow methods
        response.headers['access-control-allow-headers'] = 'Content-Type, Authorization'; // Allow headers
        res.set(response.headers); // Set the response headers
        res.status(response.status); // Set the response status
        // Send the response data
        console.log("REVERSE PROXY RESPONSE:", response.data);
        console.log("REVERSE PROXY RESPONSE HEADERS:", response.headers);
        console.log("REVERSE PROXY RESPONSE STATUS:", response.status);

        res.send(response.data);
    }).catch((error) => {
        console.error("REVERSE PROXY ERROR:", error);
        if (axios.isAxiosError(error)) {
            // If the error is an Axios error, send the response from the error
            res.status(error.response?.status || 500).send(error.response?.data || 'Internal Server Error');
        }
        else {
            // If it's not an Axios error, send a generic error message
            res.status(500).send('Internal Server Error');
        }
    });


});

// app.use('/', async (req: Request, res: Response) => {
//     res.send("A different response from the reverse proxy");
// });

// app.listen(8080, () => {
//     console.log('Reverse proxy server is running on port 8080');
// });
exports.apiProxy = functions.https.onRequest(app);