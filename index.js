'use strict';

// Imports dependencies and set up http server
const
    express = require('express'),
    bodyParser = require('body-parser'),
    requestify = require('requestify'),
    app = express().use(bodyParser.json()); // creates express http server

const pageaccesstoken = 'EAAihIcIsCAgBAGQ1yAr1BXbayDXVGesKXamXMBdEwaMzjkfHT5hZAHZBtUYrc8hjEQiVzFin8eb4NBK9tuOBFub7WAVwXCMl2L5AsqbD1OjG3Dh99IsYeMjZCLiYLcZAFG0fo5CZA6YCODRe1OCLsE21OTRZCXDmGknF9HBdSKSAZDZD'

requestify.post(`https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${pageaccesstoken}`,
    {
        "get_started": {
            "payload": "Hi"
        },
        "greeting": [
            {
                "locale": "default",
                "text": "Hello {{user_first_name}}!"
            }, {
                "locale": "en_US",
                "text": "Timeless apparel for the masses."
            }
        ]
    }
).then(response => {
    console.log(response)
}).fail(error => {
    console.log(error)
})

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "2428966177343496"

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {

    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Gets the message. entry.messaging is an array, but 
            // will only ever contain one message, so we get index 0
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);
            if (webhook_event.message) {
                var userInput = webhook_event.message.text
            }
            if (webhook_event.postback) {
                var userButton = webhook_event.postback.payload
            }
            if (userInput == 'Hi' || userButton == 'Hi') {
                //let welcomeMessage = {
                //    "recipient": {
                //        "id": webhook_event.sender.id
                //    },
                //    "message": {
                //        "text": "Hello, Welcome to Online First Aid!"
                //    }
                //}

                //first button
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message": {
                        "attachment": {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": "Welcome!",
                                        "image_url": "https://petersfancybrownhats.com/company_image.png",
                                        "subtitle": "Online First-aid in your service.",
                                        "default_action": {
                                            "type": "web_url",
                                            "url": "https://petersfancybrownhats.com/view?item=103",
                                            "webview_height_ratio": "tall",
                                        },
                                        "buttons": [
                                            {
                                                "type": "postback",                                               
                                                "title": "Injury"
                                                "payload": "Injury"
                                            }, {
                                                "type": "postback",
                                                "title": "Medicine",
                                                "payload": "medicine"
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                };



                requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`,
                    buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })
<<<<<<< HEAD
            } else if (userInput == 'Injury' || userButton == 'Injury') {

=======
            } else {
                if (userInput == 'Injury' || userButton == 'Injury') {
                     let welcomeMessage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message": {
                        "text": "Thank you!"
                    }
                }
>>>>>>> parent of a6d77f7... Update index.js
                requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`,
                    {
                        "recipient": {
                            "id": webhook_event.sender.id
                        },
                        "message": {
                            "text": "Thank you!"
                        }
                    }
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })
            }
<<<<<<< HEAD

       });

=======
        });
        //button
        "payload": {
            "template_type": "button",
                "text": "Hi",
                    "buttons": [
                < 1 >,
    < 2 >,
                        ...
                  ]
        }
>>>>>>> parent of 7cd4faa... Update index.js
        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }

});