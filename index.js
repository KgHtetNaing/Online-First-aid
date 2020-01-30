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
                "text": "You can choose your injury from the given selection or type injury from the list."
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
                                                "title": "Injury",
                                                "payload": "Injury"
                                            }
                                        ]
                                    },
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
                                                "title": "Emergency",
                                                "payload": "Emergency"
                                            }
                                        ]
                                    },
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
                                                "title": "Medicine",
                                                "payload": "Medicine"
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                };



                requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })

            } //Welcome end
            else if(userInput == 'Injury' || userButton == 'Injury'){
            	let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                    	"attachment": {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": "Choose your injury type!",
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
                                                "title": "Bleeding",
                                                "payload": "Bleeding"
                                            },

                                             
                                        ]
                                    },


                                   {
                                        "title": "Choose your injury type!",
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
                                                "title": "Burnt",
                                                "payload": "Burnt"
                                            }
                                        ]
                                    },

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
                                                "title": "Poison",
                                                "payload": "Poison"
                                            }
                                        ]
                                    },

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
                                                "title": "Bone Fracture",
                                                "payload": "Bone Fracture"
                                            }
                                        ]
                                    },
                                    
                                 ]
                            }
                        }
                    
                    }
                };

                requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })

            } //Injurytype end

                        else if(userInput == 'Bleeding' || userButton == 'Bleeding'){
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "attachment": {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": "Choose your injury!",
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
                                                "title": "Nose Bleeding",
                                                "payload": "Nose Bleeding"
                                            },

                                             
                                        ]
                                    },


                                   {
                                        "title": "Choose your injury!",
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
                                                "title": "Over Bleeding",
                                                "payload": "Over Bleeding"
                                            }
                                        ]
                                    },

                                    {
                                        "title": "Choose Your injury!",
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
                                                "title": "Bleeding Wound",
                                                "payload": "Bleeding Wound"
                                            }
                                        ]
                                    },

                                 
                                    
                                 ]
                            }
                        }
                    
                    }
                };

                requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })

            } //Injury end

                else if(userInput == 'Nose Bleeding' || userButton == 'Nose Bleeding')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":"These are the steps for curing the nose bleeding. 1. Sit Upright and lean forward. 2. Do not pack the nose.3. Use decongestant (eg. breathing steam, placing a wet warm towel) 4. Pinch the part of the nose below the nasal bones for about 10 minutes."

                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  //nosebleeding end

            else if(userInput == 'Bleeding Wound' || userButton == 'Bleeding Wound')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":"These are the steps for curing the bleeding wound. owel) 4. Pinch the part of the nose below the nasal bones for about 10 minutes."
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  //nosebleeding end
            

        }

             

        }) //end foreach

    // Returns a '200 OK' response to all requests
        	res.status(200).send('EVENT_RECEIVED');  
    } //end if == page
    else{
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }

});