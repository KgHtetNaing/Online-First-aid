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

            if(userInput == 'Hi' || userButton == 'Hi')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                   "message": { 
                "attachment" : {
                    "type" : "template",
                    "payload": {
                        "template_type": "button",
                        "text": "Choose your option",
                        "buttons": [
                      	 {
           				 "type":"phone_number",
           				 "title":"အရေးပေါ်ခေါ်ဆိုမှု",
           				 "payload":"+95119"
         				 }, 

                         {
                            "type": "postback",
                            "title": "ကုသမှု",
                            "payload": "ကုသမှု"
                        },

                         
                        ]
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

            
               }
            
           else if (userInput == 'ကုသမှု' || userButton == 'ကုသမှု') {
                
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
                                        "image_url": "https://www.jehangirhospital.com/images/centres-of-excellence-image/coe_inside_emergency_trauma.jpg",
                                        "subtitle": " ပါဝင်သည်.ကုသနည်များ (ရေနစ်ခြင်း,မြွေကိုက်ဒဏ်ရာ, CPR ကုသမှုနည်းလမ်း)",
                                        "default_action": {
                                            "type": "web_url",
                                            "url": "https://petersfancybrownhats.com/view?item=103",
                                            "webview_height_ratio": "tall",
                                        },
                                        "buttons": [
                                            {
                                                "type": "postback",                                               
                                                "title": "အရေးပေါ် ကုသမှု",
                                                "payload": "အရေးပေါ် ကုသမှု"
                                            }
                                        ]
                                    },
                                    {
                                        "title": "Welcome!",                                        
                                        "image_url": "https://previews.123rf.com/images/yupiramos/yupiramos1506/yupiramos150610219/41427239-first-aid-design-over-white-background-vector-illustration-.jpg",
                                        "subtitle": "ဒဏ်ရာကုသရန်နည်းများ.",
                                        "default_action": {
                                            "type": "web_url",
                                            "url": "https://petersfancybrownhats.com/view?item=103",
                                            "webview_height_ratio": "tall",
                                        },
                                        "buttons": [
                                            {
                                                "type": "postback",                                               
                                                "title": "ကုသမှုနည်းလမ်းများ",
                                                "payload": "ကုသမှုနည်းလမ်းများ"
                                            }
                                        ]
                                    },
                                    {
                                        "title": "Welcome!",
                                        "image_url": "https://english-blog.s3.amazonaws.com/uploads/2018/03/C_Users_GOMEDII_AppData_Local_Packages_Microsoft.SkypeApp_kzf8qxf38zg5c_LocalState_159b4db9-f791-4aa0-8431-350e45c596c9.jpg",
                                        "subtitle": "Can buy first-aid kit and other medicines.",
                                        "default_action": {
                                            "type": "web_url",
                                            "url": "https://petersfancybrownhats.com/view?item=103",
                                            "webview_height_ratio": "tall",
                                        },
                                        "buttons": [
                                            {
                                                "type": "postback",
                                                "title": "Purchasement",
                                                "payload": "Purchasement"
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
            else if(userInput == 'ကုသမှုနည်းလမ်းများ' || userButton == 'ကုသမှုနည်းလမ်းများ'){
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
                                        "image_url": "https://cdn3.vectorstock.com/i/1000x1000/90/27/finger-with-blood-drop-on-white-background-vector-19899027.jpg",
                                        "subtitle": "ပါ၀င်သည့်ကုသနည်းမျာ: (နှာခေါင်းသွေးထွက်ဒဏ်ရာ,ပြင်းထန်သွေးထွက်ဒဏ်ရာ,ပုံမှန်သွေးထွက်အနာ)",
                                        "default_action": {
                                            "type": "web_url",
                                            "url": "https://petersfancybrownhats.com/view?item=103",
                                            "webview_height_ratio": "tall",
                                        },
                                        "buttons": [
                                            {
                                                "type": "postback",                                               
                                                "title": "သွေးထွက်ဒဏ်ရာများ",
                                                "payload": "သွေးထွက်ဒဏ်ရာများ"
                                            },

                                             
                                        ]
                                    },


                                   {
                                        "title": "Choose your injury type!",
                                        "image_url": "https://cdn1.pegasaas.io/2d65/img/wp-content/uploads/2019/09/Brauns-Law-Burn-Injury-Lawyer-e1568040798860-524x402---524x402.jpg",
                                        "subtitle": "ပါ၀င်သည့်ကုသနည်းမျာ: (ရေနွေးငွေ့လောင်ဒဏ်ရာ,လျှပ်စစ်လောင်ဒဏ်ရာ,ဓာတုလောင်ကျွမ်:ဒဏ်ရာ)",
                                        "default_action": {
                                            "type": "web_url",
                                            "url": "https://petersfancybrownhats.com/view?item=103",
                                            "webview_height_ratio": "tall",
                                        },
                                        "buttons": [
                                            {
                                                "type": "postback",
                                                "title": "လောင်ကျွမ်းဒဏ်ရာများ",
                                                "payload": "လောင်ကျွမ်းဒဏ်ရာများ"
                                            }
                                        ]
                                    },

                                    {
                                        "title": "Choose your injury type!",
                                        "image_url": "https://images.ctfassets.net/cnu0m8re1exe/2QNU6xdc3SfDWEroBDqMJg/7f5af4db4c432f265e22259b64ff02fa/bee-poison.jpg?w=650&h=433&fit=fill",
                                        "subtitle": "ပါ၀င်သည့်ကုသနည်းမျာ: (ဆေးဝါးအလွန်အကျွံသုံးစွဲမှု,မျက်လုံးထဲအဆိပ်၀င်,အင်းဆက်ပိုးကိုက်ဒဏ်ရာ).",
                                        "default_action": {
                                            "type": "web_url",
                                            "url": "https://petersfancybrownhats.com/view?item=103",
                                            "webview_height_ratio": "tall",
                                        },
                                        "buttons": [
                                            {
                                                "type": "postback",
                                                "title": "အဆိပ်သင့်ဒဏ်ရာမျာ",
                                                "payload": "အဆိပ်သင့်ဒဏ်ရာမျာ"
                                            }
                                        ]
                                    },

                                    {
                                        "title": "Choose your injury type!",
                                        "image_url": "https://st4.depositphotos.com/7477946/19915/i/1600/depositphotos_199156806-stock-photo-first-aid-hand-broken-hand.jpg",
                                        "subtitle": "အရိုးကျိုးခြင်:,အဆစ်လွဲ",
                                        "default_action": {
                                            "type": "web_url",
                                            "url": "https://petersfancybrownhats.com/view?item=103",
                                            "webview_height_ratio": "tall",
                                        },
                                        "buttons": [
                                            {
                                                "type": "postback",
                                                "title": "အရိုးဒဏ်ရာ",
                                                "payload": "အရိုးဒဏ်ရာ"
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

                        else if(userInput == 'သွေးထွက်ဒဏ်ရာများ' || userButton == 'သွေးထွက်ဒဏ်ရာများ'){
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
                                        "image_url": "https://cdn.cdnparenting.com/articles/2018/01/704685511-H.jpg",
                                        "subtitle": "ကျေးဇူးပြု၍ ကုသမှုခံယူပြီးနောက်၌ပင်သင့်တော်သောကျန်းမာရေးစောင့်ရှောက်မှုကိုရယူပါ!.",
                                        "default_action": {
                                            "type": "web_url",
                                            "url": "https://petersfancybrownhats.com/view?item=103",
                                            "webview_height_ratio": "tall",
                                        },
                                        "buttons": [
                                            {
                                                "type": "postback",                                               
                                                "title": "နှာခေါင်းသွေးထွက်ဒဏ်ရာ",
                                                "payload": "နှာခေါင်းသွေးထွက်ဒဏ်ရာ"
                                            },
                                            {
                                                "type": "postback",                                               
                                                "title": "နှာခေါင်းသွေးထွက်ဒဏ်ရာအကြောင်:",
                                                "payload": "နှာခေါင်းသွေးထွက်ဒဏ်ရာအကြောင်:"
                                            },

                                             
                                        ]
                                    },


                                   {
                                        "title": "Choose your injury!",
                                        "image_url": "https://nkilmer2016.weebly.com/uploads/6/0/7/5/60755477/9132875.jpg?1452002303",
                                        "subtitle": "ကျေးဇူးပြု၍ ကုသမှုခံယူပြီးနောက်၌ပင်သင့်တော်သောကျန်းမာရေးစောင့်ရှောက်မှုကိုရယူပါ!",
                                        "default_action": {
                                            "type": "web_url",
                                            "url": "https://petersfancybrownhats.com/view?item=103",
                                            "webview_height_ratio": "tall",
                                        },
                                        "buttons": [
                                            {
                                                "type": "postback",
                                                "title": "ပြင်းထန်သွေးထွက်ဒဏ်ရာ",
                                                "payload": "ပြင်းထန်သွေးထွက်ဒဏ်ရာ"
                                            },
                                             {
                                                "type": "postback",                                               
                                                "title": "ပြင်းထန်သွေးထွက်ဒဏ်ရာအကြောင်:",
                                                "payload": "ပြင်းထန်သွေးထွက်ဒဏ်ရာအကြောင်:"
                                            },
                                        ]
                                    },

                                    {
                                        "title": "Choose Your injury!",
                                        "image_url": "https://www.wikihow.com/images/thumb/5/5d/Treat-a-Minor-Cut-Step-1-Version-2.jpg/aid2103769-v4-728px-Treat-a-Minor-Cut-Step-1-Version-2.jpg.webp",
                                        "subtitle": "ကျေးဇူးပြု၍ ကုသမှုခံယူပြီးနောက်၌ပင်သင့်တော်သောကျန်းမာရေးစောင့်ရှောက်မှုကိုရယူပါ",
                                        "default_action": {
                                            "type": "web_url",
                                            "url": "https://petersfancybrownhats.com/view?item=103",
                                            "webview_height_ratio": "tall",
                                        },
                                        "buttons": [
                                            {
                                                "type": "postback",
                                                "title": "ပုံမှန်သွေးထွက်အနာ",
                                                "payload": "ပုံမှန်သွေးထွက်အနာ"
                                            },
                                             {
                                                "type": "postback",                                               
                                                "title": "ပုံမှန်သွေးထွက်အနာအကြောင်:",
                                                "payload": "ပုံမှန်သွေးထွက်အနာအကြောင်:"
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

                else if(userInput == 'နှာခေါင်းသွေးထွက်ဒဏ်ရာ' || userButton == 'နှာခေါင်းသွေးထွက်ဒဏ်ရာ')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`\n\n1.တည့်တည့်ထိုင်ပြီး ကိုယ်ကို အရှေ့သို့ကိုင်းထားပါ.\n\n2.နှာခေါင်းရိုးအောက်ပိုင်းကို ၁၀မိနစ်ခန့်ဖိပေးထားပါ.\n\n3.ရေခဲ သို့မဟုတ် ခဲနေသောအရာများကို ပုဝါနဲ့ထုပ်ကာ နှာခေါင်းပေါ်သို့ဖိပေးပါ\n\n4.သွေးထွက်မရပ်သေးပါက နှာခေါင်းရိုးအောက်ကို ၅မိနစ်ခန့်ထပ်ဖိပေးပါ.`
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        } //nosebleed end

         else if(userInput == 'ပုံမှန်သွေးထွက်အနာ' || userButton == 'ပုံမှန်သွေးထွက်အနာ')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`\n\n1. အနာကိုဆပ်ပြာနှင့်ရေနွေးဖြင့်ညင်သာစွာဆေးကြောပါ.\n\n2. အနာပေါ်သုံးသည့်ပိုးသတ်‌ဆေးသုံးပြီး ပတ်တီး ဖြင့်ပတ်ပါ.\n\n3.နေ့စဉ်ပတ်တီးကိုလဲပါ.`
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        } //bleeding wound end

        else if(userInput == 'ပြင်းထန်သွေးထွက်ဒဏ်ရာ' || userButton == 'ပြင်းထန်သွေးထွက်ဒဏ်ရာ')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`\n\n1. သန်.ရှင်းသောအ၀တ် သို့မဟုတ်တစ်ရှူးဖြင့်ဖြတ် အနာကိုတိုက်ရိုက်ဖိအားပေးပါ.\n\n2.အုပ်ထားသည့်အ၀တ်ထဲသို့သွေးများစိမ့်လာပါက အုပ်ထားသည့်အ၀တ်ကိုမဖယ်ဘဲ နောက်အ၀တ်တစ်ခုကိုအပေါ်မှ ထပ်ဖိပါ\n\n3.အနာသည်လက်မောင်းသို့မဟုတ်ခြေထောက်ပေါ်မှာဆိုပါက သွေးထွက်နည်းအောင် ဒဏ်ရာကို နှလုံးအပေါ်သို့ရောက်‌အောင်‌မြှောက်ထားပေးပါ`
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        } //Overbleeding end

      

         else if(userInput == 'လောင်ကျွမ်းဒဏ်ရာများ' || userButton == 'လောင်ကျွမ်းဒဏ်ရာများ'){
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
                                        "image_url": "https://library.kissclipart.com/20181218/cxe/kissclipart-burn-child-first-aid-patient-fcca7c43278b9d02.png",
                                        "subtitle": "ကျေးဇူးပြု၍ ကုသမှုခံယူပြီးနောက်၌ပင်သင့်တော်သောကျန်းမာရေးစောင့်ရှောက်မှုကိုရယူပါ!",
                                        "default_action": {
                                            "type": "web_url",
                                            "url": "https://petersfancybrownhats.com/view?item=103",
                                            "webview_height_ratio": "tall",
                                        },
                                        "buttons": [
                                            {
                                                "type": "postback",                                               
                                                "title": "ရေနွေးငွေ့လောင်ဒဏ်ရာ",
                                                "payload": "ရေနွေးငွေ့လောင်ဒဏ်ရာ"
                                            },
                                             {
                                                "type": "postback",                                               
                                                "title": "ရေနွေးငွေ့လောင်ဒဏ်ရာအကြောင်:",
                                                "payload": "ရေနွေးငွေ့လောင်ဒဏ်ရာအကြောင်:"
                                            },

                                             
                                        ]
                                    },


                                    {
                                        "title": "Choose your injury!",
                                        "image_url": "https://www.wikihow.com/images/thumb/d/d7/Treat-Electrical-Burns-Step-20.jpg/aid544981-v4-728px-Treat-Electrical-Burns-Step-20.jpg",
                                        "subtitle": "ကျေးဇူးပြု၍ ကုသမှုခံယူပြီးနောက်၌ပင်သင့်တော်သောကျန်းမာရေးစောင့်ရှောက်မှုကိုရယူပါ!",
                                        "default_action": {
                                            "type": "web_url",
                                            "url": "https://petersfancybrownhats.com/view?item=103",
                                            "webview_height_ratio": "tall",
                                        },
                                        "buttons": [
                                            {
                                                "type": "postback",
                                                "title": "လျှပ်စစ်လောင်ဒဏ်ရာ",
                                                "payload": "လျှပ်စစ်လောင်ဒဏ်ရာ"
                                            },
                                             {
                                                "type": "postback",                                               
                                                "title": "လျှပ်စစ်လောင်ဒဏ်ရာအကြောင်:",
                                                "payload": "လျှပ်စစ်လောင်ဒဏ်ရာအကြောင်:"
                                            },
                                        ]
                                    },

                                    {
                                        "title": "Choose your injury!",
                                        "image_url": "https://comps.canstockphoto.com/drain-cleaner-burn-illustration_csp5353742.jpg",
                                        "subtitle": "ကျေးဇူးပြု၍ ကုသမှုခံယူပြီးနောက်၌ပင်သင့်တော်သောကျန်းမာရေးစောင့်ရှောက်မှုကိုရယူပါ!",
                                        "default_action": {
                                            "type": "web_url",
                                            "url": "https://petersfancybrownhats.com/view?item=103",
                                            "webview_height_ratio": "tall",
                                        },
                                        "buttons": [
                                            {
                                                "type": "postback",
                                                "title": "ဓာတုလောင်ကျွမ်းဒဏ်ရာ",
                                                "payload": "ဓာတုလောင်ကျွမ်းဒဏ်ရာ"
                                            },
                                             {
                                                "type": "postback",                                               
                                                "title": "ဓာတုလောင်ကျွမ်းဒဏ်ရာအကြောင်:",
                                                "payload": "ဓာတုလောင်ကျွမ်းဒဏ်ရာအကြောင်:"
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

           else if(userInput == 'ရေနွေးငွေ့လောင်ဒဏ်ရာ' || userButton == 'ရေနွေးငွေ့လောင်ဒဏ်ရာ')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`\n\n1.အပူလောင်ဒဏ်ရာပေါ်သို့ ရေအေး (အရမ်းမအေး) ကို မိနစ် ၂၀ ခန့်လောင်းချပေးပါ.\n\n2.သွားတိုက်ဆေးဖြင့်အုံထားခြင်းမပြုရ\n\n3.လိုအပ်ပါက pain-killer ကိုသုံးပါ.\n\n4.နေရောင်ဖြင့်ထိခြင်းမှရှောင်ပါ`
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        } //steamburn end

         else if(userInput == 'လျှပ်စစ်လောင်ဒဏ်ရာ' || userButton == 'လျှပ်စစ်လောင်ဒဏ်ရာ')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`These are the steps for treating electric burn before the healthcare arrive.\n\n1.Perform CPR(shown in Emergency section) if the patient is unresponsive.\n\n2.Can not let the patient become chilled.\n\n3.Cover the burn aread with a sterile bandage or clean cloth.Do not use a blanket or towel as loose fiber can stick to the burnt area.`
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
                        "text":`These are the steps for treating Chemical burn before the healthcare arrive.\n\n1.Remove the cause of the burn by running the cool water on it for 10 minutes.For dry chemicals, use brush or gloves.\n\n2.Remove clothing or accessory which has been contaminated by the chemical.\n\n3.Bandge the burn with sterile gauze bandage or a clean cloth. Do not use fluffy cotton. Bandge loosely to prevent from putting pressure on the burned skin.\n\n4.If the patient stil feel burn after the flushing, flush the area again with water.`
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
                                        "image_url": "https://apps-cloud.n-tv.de/img/20947246-1554366750000/16-9/750/34725025.jpg",
                                        "subtitle": "Please get proper healthcare even after the treatment!",
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
                                        "image_url": "https://lh6.googleusercontent.com/proxy/0DYatcTMLCU7sx07kORhF4Xoqd4_-IW-GOj04sKoyIJohoG0ObUNmASxtcSp87wEJ1x8nG1xNS4hXc56dHojfzmDD12w33PqpFOL6bAepUir-7AYua9X4YjgSWxVSs-eZG8",
                                        "subtitle": "Please get proper healthcare even after the treatment!.",
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
                                        "image_url": "https://media.istockphoto.com/photos/bug-bites-picture-id519420274",
                                        "subtitle": "Please get proper healthcare even after the treatment!.",
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
                        "text":`These are the steps for treating drug toxicity before the healthcare arrive.\n\n1.First,place the patient on their side in the recovery position.\n\n2.Ensure that the airway remain open by tilting head back and lifting chin.\n\n3.If the drug toxcity is due to overdose,try pumping the stoamch to remove the drugs	which have not been absorbed. Activated charcoal may be given to prevent the drugs from being absorbed into the blood.\n\n4.Bring the pill containers to the hospital.`
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
                        "text":`These are the steps for treating poison in the eye before the healthcare arrive.\n\n1.Flush the eye with luckewarm water for about 15 to 30 minutes. Have the eyes rinsed or eyes under a faucet in a gentle shower or with a clean container of tower.\n\n2.The patient should keep the eyes as wide as possible.\n\n3.Do not rub the eyes or place bandages over the eye.\n\n4.The patient should wear sunglasses to reduce light sensitivity as much as possible before the medical care arrive\n\n5.Make sure to know what chemical got into the eye so the medical team can give treatment.`
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
                        "text":`These are the steps for treating the bug bite before the healthcare arrive.\n\n1.Remove the tick, stings or hair if still there.\n\n2.Washed the affected area with soap and water.\n\n3.Apply the cold compress or an icepack to the affected area for at least 10 minutes.\n\n4.Raise the affected area if possible, it can helps in reducing the swelling.\n\n5.Prevent from scratching or bursting any blisters to reduce the risk of infection.\n\n6.Home remedies like vinegar and bicarbonate of soda should not be use as they are unlikely to help.`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        } //bugbite end

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
                                        "image_url": "https://cdn.24.co.za/files/Cms/General/d/5259/ea5f47648615427182386d541d1dc1ea.jpg",
                                        "subtitle": "Please get proper healthcare even after the treatment!.",
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
                                        "image_url": "https://www.summitmedicalgroup.com/media/db/relayhealth-images/fingdisl_3.jpg",
                                        "subtitle": "Please get proper healthcare even after the treatment!",
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

             else if(userInput == 'Broken Bone' || userButton == 'Broken Bone')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`These are the steps for treating broken bone before the healthcare arrive.\n\n1.If the wound is bleeding, try and stop it by using a sterile bandage,a clean cloth or a clean piece of clothing and elevating the injured aread\n\n2.If it is the neck or back which is broken, try to make the patient stay still as much as possible.If it is the limbs which is broken, immobalize using a splint or sling.\n\n3.After that, wrap an ice pack or bag of ice cubes in a cloth and press it onto the injured aread for up to 10 minutes at a time.\n\n5.If the patient become unconscious or does not appear to be breathing, perform CPR(shown in Emergency)`
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//brokenbone end

         else if(userInput == 'Bone Disclocation' || userButton == 'Bone Disclocation')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`These are the steps for treating broken bone before the healthcare arrive.\n\n1.Leave the joint alone and do not attempt to move or jam a dislocated bone as it can destroy blood vessels.\n\n2.Wrap a cloth around the ice and press it around the discolated bone.\n\nUse painkiller if necessary.`
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        } //bonedisclocation end

         else if(userInput == 'About N' || userButton == 'Bug Bite')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`These are the steps for treating the bug bite before the healthcare arrive.\n\n1.Remove the tick, stings or hair if still there.\n\n2.Washed the affected area with soap and water.\n\n3.Apply the cold compress or an icepack to the affected area for at least 10 minutes.\n\n4.Raise the affected area if possible, it can helps in reducing the swelling.\n\n5.Prevent from scratching or bursting any blisters to reduce the risk of infection.\n\n6.Home remedies like vinegar and bicarbonate of soda should not be use as they are unlikely to help.`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }

        else if(userInput == 'Emergency' || userButton == 'Emergency')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                   "message": { 
                "attachment" : {
                    "type" : "template",
                    "payload": {
                        "template_type": "button",
                        "text": "Emergency Treatment",
                        "buttons": [
                        {
                            "type": "postback",
                            "title": "Drowning",
                            "payload": "Drowning"
                        },

                         {
                            "type": "postback",
                            "title": "Snake Bite",
                            "payload": "Snake Bite"
                        },

                          {
                            "type": "postback",
                            "title": "CPR",
                            "payload": "CPR"
                        },




                        ]
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

            
               }//emergency


          else if(userInput == 'About Nose Bleeding' || userButton == 'About Nose Bleeding')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`Nose bleeding occurs for many reasons. But mostly because of dramatic weather changes, injury and dry air. Even though it is not very severe, it can still impose certain danger of letting blood run back into throat and block the breathing`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//about nose bleed end

         else if(userInput == 'About Over Bleeding' || userButton == 'About Over Bleeding')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`Overbleeding is when an injury bleed alot and the bleeding cannot be stopped which is usually caused by injury. It is dangerous and lethal.`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//about over bleeding end

         else if(userInput == 'About Bleeding Wound' || userButton == 'About Bleeding Wound')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`Bleeding wound is a minor wound with bleeding which is usually caused becuase of injuries. Even though it is not lethal in most cases, there are still danger of getting infection.`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//about bleeding wound end

         else if(userInput == 'About Steam Burn' || userButton == 'About Steam Burn')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`Steam burn occurs when got burn by the hot liquid or hot vapor. The lethality depends on the degree of burns.`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//steamburn end

        else if(userInput == 'About Electrical Burn' || userButton == 'About Electrical Burn')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`Electrical burn occurs when an electric make contact with the body. Even minor burn can be severe.Electrical burn cause more danage then steam and chemical burn. Require immediate treatment. `
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//about electricalburn end

        else if(userInput == 'About Chemical Burn' || userButton == 'About Chemical Burn')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`Chemical burns occur when the skin make contact with an acid or base or makeup products. The severity depends on how long and how much of body contact with the chemical.`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//about chemical burn end

        else if(userInput == 'About Drug Toxicity' || userButton == 'About Drug Toxicity')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`Drug toxicity can occur because of the overdose of the drugs or if the medicine or poison which is not suitable for the body is taken. It is highly lethal if the treatment is not taken immediately.`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//about drug toxicity end

        else if(userInput == 'About Poison in the eye' || userButton == 'About Poison in the eye')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`Poison in the eye can cause when the poison get into the eyes either directly or indirectly (eg.thorugh hands which touched chemical). Beauty products and insecticides are most common poisons to get in the eye. Can be severe if not treated immediately.`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//about poisonintheeye end

            else if(userInput == 'About Bug Bite' || userButton == 'About Bug Bite')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`This can be caused when the poisonous bugs bite the body. Very common and not lethal in most cases and only causes itiching and pain.`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//about bug bite end

         else if(userInput == 'About Broken Bone' || userButton == 'About Broken Bone')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`This can be caused when the bone is broken due to accidents like tripping or falling or got hit by something. The symptons include swelling or brusing over the bones. Pain in the injured area which gets worse when the area is moved or pressure is applied. Can cause severe injuries in some cases.`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//about brokenbone end

            else if(userInput == 'About Bone Disclocation' || userButton == 'About Bone Disclocation')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`Bone discloation is the case where one bone is forced to move out of the position or temporarily deform in joint area where two bones meet. This differs from broken bone as this is not as severe as the broken bone and can be treated well if the person with well-informed medical knowledge is there. Can cause a lot of pain and most commonly happen in fingers and shoulders. `
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })
            

        }//about bonedislocaton end

         else if(userInput == 'Drowning' || userButton == 'Drowning')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`1.First, try to wake the patient.\n\n2.Lie the patient on his back and open his airway by tilting his chin and head backwards.\n\n3.Pinch his nose and keep their head tilted back as you give rescue breath into their mouth from yours.Each breath should last for 1 second.\n\n4.Perform CPR(shown in emergency) for 1 minute (120 compressions).\n\n5.After that, call for the emergency contact. `
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })
            

        }//drowning end

         else if(userInput == 'Snake Bite' || userButton == 'Snake Bite')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`1.First, try to calm down the patient and try not to make him move. Poison does not make it into the blood stream directly. It makes into the lymph and by not moving poison in the lymph will not get into the blood.\n\n2.Do not try to identify or catch the snake if out of capability as it can result in more victims. Hospitals can make several tests to identify the snake and give most appropriate treatment.\n\n3.Use a pad or plastic like cling wrap on the snake bite to soak up or protect the venom for later testing.\n\n4.Use an elasticised bandage and roll it over the snake bite.\n\n5.Use another bandage starting just above the fingers or toes and moving upwards on the bitten limb.\n\n6.If there is no bandage, you can use other stretchy materials like torn-up t-shirts, stockings or other fabircs)\n\n7.Make the snake bite on the bandage and immobalize the limb by splinting the limb with stick or other straight objects.\n\n8.Do not cut, suck or wash the wound as it can cause more harm then good. `
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })
            

       	 }//snakebite end

     	
       	 else if(userInput == "CPR" || userButton == "CPR")
       	  {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`1.Position your hand. Ensure that the patient is lying on his back on the firm surface. Kneel beside him and place the heel of the hand on the center of the chest. \n\n2.Interlock fingers. Keep your hand straight, cover the first hand with the heel of other hand and interlock the fingers of both hands together. Keep your fingers raised so they do no touch the patient's chest or rib cage. \n\n3.Give chest compressions. Lean forward so that your shoulders are directly over the patient's chest and press down on the chest about two inches. Release the pressure, but not your hands and let the chest come back up. Repeat to give 30 compressions at a rate of 100 compressions per minute.\n\n4.Open the airway. Move to the patient's head. Tilt his head and lift his chin to open the airway again. \n\n5.Give resuce breaths. Pinch the patient's nose and give a resuce breath into the patient's mouth from your mouth. Blow until you can see the patient's chest rise..\n\n6.Watch chest fall. Remove your mouth from the patient's and look at the chest fall of the patient. Repeat step five and six once. \n\n7.Repeat chest compressions and resuce breaths. Repeat the 30 chest compressions, followed by two resuce breaths. `
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })
            

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