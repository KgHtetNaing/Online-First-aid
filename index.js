'use strict';

// Imports dependencies and set up http server
const
    express = require('express'),
    bodyParser = require('body-parser'),
    requestify = require('requestify'),
    app = express().use(bodyParser.json()); // creates express http server

const pageaccesstoken = 'EAAihIcIsCAgBAGQ1yAr1BXbayDXVGesKXamXMBdEwaMzjkfHT5hZAHZBtUYrc8hjEQiVzFin8eb4NBK9tuOBFub7WAVwXCMl2L5AsqbD1OjG3Dh99IsYeMjZCLiYLcZAFG0fo5CZA6YCODRe1OCLsE21OTRZCXDmGknF9HBdSKSAZDZD'



app.get('/greeting', (req, res) => {
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
                "text":"This system is not the replacement of the doctors or clinics. Patients should still seek for the treatment from the doctor even after the treatment from the shown methods."
            }
        ]
    }
).then(response => {
    console.log(response)
}).fail(error => {
    console.log(error)
});

});

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
                                                "title": "Poison",
                                                "payload": "Poison"
                                            }
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
                                            {
                                                "type": "postback",                                               
                                                "title": "About Nose Bleeding",
                                                "payload": "About Nose Bleeding"
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
                                            },
                                             {
                                                "type": "postback",                                               
                                                "title": "About Over Bleeding",
                                                "payload": "About Over Bleeding"
                                            },
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
                                            },
                                             {
                                                "type": "postback",                                               
                                                "title": "About  Bleeding Wound",
                                                "payload": "About  Bleeding Wound"
                                            },
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
                        "text":`These are the steps for treating the nose bleeding.\n\n1. Sit Upright and lean forward.\n\n2. Do not pack the nose.\n\n3. Use decongestant (eg. breathing steam, placing a wet warm towel)\n\n4. Pinch the part of the nose below the nasal bones for about 10 minutes.`
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        } //nosebleed end

         else if(userInput == 'Bleeding Wound' || userButton == 'Bleeding Wound')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`These are the steps for treating the bleeding wound.\n\n1. Gently clean the wound with soap and warm water.\n\n2. Apply antibiotics and cover the wound with the bandage.\n\n3.Change the bandage daily.`
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        } //bleeding wound end

        else if(userInput == 'Over Bleeding' || userButton == 'Over Bleeding')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`These are the steps for stopping the over bleeding.\n\n1. Apply direct pressure on the cut or wound with a clean cloth or tissue.\n\n2. If blood still soaks thorugh material, put more cloth without removing the already applied cloth.\n\n3.If the wound is on the arm or legs, raise it above the heart to slow bleeding.`
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        } //Overbleeding end

      

         else if(userInput == 'Burnt' || userButton == 'Burnt'){
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
                                        "title": "Choose your injury !",
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
                                                "title": "Steam Burn",
                                                "payload": "Steam Burn"
                                            },
                                             {
                                                "type": "postback",                                               
                                                "title": "About Steam Burn",
                                                "payload": "About Steam Burn"
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
                                                "title": "Electrical Burn",
                                                "payload": "Electrical Burn"
                                            },
                                             {
                                                "type": "postback",                                               
                                                "title": "About Electrical Burn",
                                                "payload": "About Electrical Burn"
                                            },
                                        ]
                                    },

                                    {
                                        "title": "Choose your injury!",
                                        "image_url": "",
                                        "subtitle": "Online First-aid in your service.",
                                        "default_action": {
                                            "type": "web_url",
                                            "url": "https://petersfancybrownhats.com/view?item=103",
                                            "webview_height_ratio": "tall",
                                        },
                                        "buttons": [
                                            {
                                                "type": "postback",
                                                "title": "Chemical Burn",
                                                "payload": "Chemical Burn"
                                            },
                                             {
                                                "type": "postback",                                               
                                                "title": "About Chemical Burn",
                                                "payload": "About Chemical Burn"
                                            },
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

            }//burninjury end

           else if(userInput == 'Steam Burn' || userButton == 'Steam Burn')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`These are the steps for treating the steam burn.\n\n1.Apply cool (not cold) water over the burn area for about 20 minutes.\n\n2.Use cool compresses (cloth dipped in cool water) if water is not available. Do not use toothpaste.\n\n3.Take pain reliever if necessary.\n\n4.Reduce sun exposure`
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        } //steamburn end

         else if(userInput == 'Electrical Burn' || userButton == 'Electrical Burn')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`These are the steps for treating electric burn.\n\n1.Perform CPR(shown in Emergency section) if the patient is unresponsive.\n\n2.Can not let the patient become chilled.\n\n3.Cover the burn aread with a sterile bandage or clean cloth.Do not use a blanket or towel as loose fiber can stick to the burnt area.`
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        } //electriclaburn end

         else if(userInput == 'Chemical Burn' || userButton == 'Chemical Burn')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`These are the steps for treating Chemical burn.\n\n1.Remove the cause of the burn by running the cool water on it for 10 minutes.For dry chemicals, use brush or gloves.\n\n2.Remove clothing or accessory which has been contaminated by the chemical.\n\n3.Bandge the burn with sterile gauze bandage or a clean cloth. Do not use fluffy cotton. Bandge loosely to prevent from putting pressure on the burned skin.\n\n4.If the patient stil feel burn after the flushing, flush the area again with water.`
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        } //chemcialburn end

         else if(userInput == 'Poison' || userButton == 'Poison'){
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
                                        "title": "Choose your injury !",
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
                                                "title": "Drug Toxicity",
                                                "payload": "Drug Toxicity"
                                            },
                                             {
                                                "type": "postback",                                               
                                                "title": "About Drug Toxicity",
                                                "payload": "About Drug Toxicity"
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
                                                "title": "Poison in the eye",
                                                "payload": "Poison in the eye"
                                            },
                                             {
                                                "type": "postback",                                               
                                                "title": "About Poison in the eye",
                                                "payload": "About Poison in the eye"
                                            },
                                        ]
                                    },

                                   

                                     {
                                        "title": "Choose your injury!",
                                        "image_url": "",
                                        "subtitle": "Online First-aid in your service.",
                                        "default_action": {
                                            "type": "web_url",
                                            "url": "https://petersfancybrownhats.com/view?item=103",
                                            "webview_height_ratio": "tall",
                                        },
                                        "buttons": [
                                            {
                                                "type": "postback",
                                                "title": "Bug Bite",
                                                "payload": "Bug Bite"
                                            },
                                             {
                                                "type": "postback",                                               
                                                "title": "About Bug Bite",
                                                "payload": "About Bug Bite"
                                            },
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

            }//Poisontype end

             else if(userInput == 'Drug Toxicity' || userButton == 'Drug Toxicity')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`These are the steps for treating drug toxicity.\n\n1.First,place the patient on their side in the recovery position.\n\n2.Ensure that the airway remain open by tilting head back and lifting chin.\n\n3.If the drug toxcity is due to overdose,try pumping the stoamch to remove the drugs	which have not been absorbed. Activated charcoal may be given to prevent the drugs from being absorbed into the blood.\n\n4.Bring the pill containers to the hospital.`
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//drugtoxicity end

         else if(userInput == 'Poison in the eye' || userButton == 'Poison in the eye')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`These are the steps for treating poison in the eye.\n\n1.Flush the eye with luckewarm water for about 15 to 30 minutes. Have the eyes rinsed or eyes under a faucet in a gentle shower or with a clean container of tower.\n\n2.The patient should keep the eyes as wide as possible.\n\n3.Do not rub the eyes or place bandages over the eye.\n\n4.The patient should wear sunglasses to reduce light sensitivity as much as possible before the medical care arrive\n\n5.Make sure to know what chemical got into the eye so the medical team can give treatment.`
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//poisonintheeye end

        else if(userInput == 'Bug Bite' || userButton == 'Bug Bite')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`These are the steps for treating the bug bite.\n\n1.Remove the tick, stings or hair if still there.\n\n2.Washed the affected area with soap and water.\n\n3.Apply the cold compress or an icepack to the affected area for at least 10 minutes.\n\n4.Raise the affected area if possible, it can helps in reducing the swelling.\n\n5.Prevent from scratching or bursting any blisters to reduce the risk of infection.\n\n6.Home remedies like vinegar and bicarbonate of soda should not be use as they are unlikely to help.`
                    },
                    "message": { 
                attachment : {
                    type : "template",
                    payload: {
                        template_type: "button",
                        text: "What kind of food?",
                        buttons: [
                        {
                            type: "postback",
                            title: "snack",
                            payload: "snack"
                        }]
                    }
                }

            }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        } //buybite end

         else if(userInput == 'Bone Fracture' || userButton == 'Bone Fracture'){
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
                                                "title": "Broken Bone",
                                                "payload": "Broken Bone"
                                            },
                                            {
                                                "type": "postback",                                               
                                                "title": "About Broken Bone",
                                                "payload": "About Broken Bone"
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
                                                "title": "Bone Disclocation",
                                                "payload": "Bone Disclocation"
                                            },
                                             {
                                                "type": "postback",                                               
                                                "title": "About Bone Disclocation",
                                                "payload": "About Bone Disclocation"
                                            },
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

            }//bonefracture end

            



             

        }) //end foreach

    // Returns a '200 OK' response to all requests
        	res.status(200).send('EVENT_RECEIVED');  
    } //end if == page
    else{
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }

});