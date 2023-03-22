
const cds = require('@sap/cds');

const axios = require('axios').default;



const oAuthSettings = {

    clientid: 'sb-afg-server!t20207',

    clientsecret: 'Ilrd/Fhwy1e+G87KZ8eCG+3Qprk=',

    url: "https://prod-rdb-0kbw4gw1.authentication.eu20.hana.ondemand.com/oauth/token?grant_type=client_credentials",

};



cds.on('bootstrap', app => {

    app.get('/getToken', async (req, res) => {

        console.log('Token requested ...');

        try {

            const response = await axios({

                method: 'GET',

                url: oAuthSettings.url,

                auth: {

                    username: oAuthSettings.clientid,

                    password: oAuthSettings.clientsecret

                }

            });

            console.log('Response received:', response.status);

            res.send(response.data);

        } catch (error) {

            console.log('Error occcured:', error.response.data);

            res.send(error.response.data);

        }

    });

});



module.exports = cds.server();

