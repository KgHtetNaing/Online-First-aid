'use strict';

// Imports dependencies and set up http server
const
    express = require('express'),
    firebase = require("firebase-admin"),
    bodyParser = require('body-parser'),
    requestify = require('requestify'),
    app = express().use(bodyParser.json()); // creates express http server

const pageaccesstoken = 'EAAihIcIsCAgBAGQ1yAr1BXbayDXVGesKXamXMBdEwaMzjkfHT5hZAHZBtUYrc8hjEQiVzFin8eb4NBK9tuOBFub7WAVwXCMl2L5AsqbD1OjG3Dh99IsYeMjZCLiYLcZAFG0fo5CZA6YCODRe1OCLsE21OTRZCXDmGknF9HBdSKSAZDZD'

let questions = {
	"name":false,
	"phone":false,
	"address":false
}

let userAnswers = {};

firebase.initializeApp({
  credential: firebase.credential.cert({
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "project_id": process.env.FIREBASE_PROJECT_ID,
  }),
  databaseURL: "https://khn-online-first-aid.firebaseio.com"
});

let db = firebase.firestore();

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

// menu get function
app.get('/setupPersistentMenu', function(req,res)
    {
        setupPersistentMenu(res);
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
});//end of get webhook

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
            	if(webhook_event.message.quick_reply){
            		var userQuickReply = webhook_event.message.quick_reply.payload;
            	}else{
            		var userInput = webhook_event.message.text;
            	}
                 
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
                                                "title": "သာမန်ကုသမှုနည်းလမ်းများ",
                                                "payload": "သာမန်ကုသမှုနည်းလမ်းများ"
                                            }
                                        ]
                                    },
                                    {
                                        "title": "Welcome!",
                                        "image_url": "https://stylesatlife.com/wp-content/uploads/2018/03/Daily-Health-Tips.png",
                                        "subtitle": "သင်၏အ‌‌ခြေအနေပေါ်မူတည်၍နေ့စဉ် ကျမ်းမာစွာနေနိုင်ရန် နည်းလမ်းမျာ:",
                                        "default_action": {
                                            "type": "web_url",
                                            "url": "https://petersfancybrownhats.com/view?item=103",
                                            "webview_height_ratio": "tall",
                                        },
                                        "buttons": [
                                            {
                                                "type": "postback",
                                                "title": "နေ့စဉ်ကျန်းမာရေ:",
                                                "payload": "နေ့စဉ်ကျန်းမာရေ:"
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

            else if(userInput == 'နေ့စဉ်ကျန်းမာရေ:' || userButton == 'နေ့စဉ်ကျန်းမာရေ:'){
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                   "message": { 
                "attachment" : {
                    "type" : "template",
                    "payload": {
                        "template_type": "button",
                        "text": "ရောဂါရှိပါသလား။",
                        "buttons": [
                      	 {
           				 "type":"postback",
           				 "title":"မရှိပါ။",
           				 "payload":"မရှိပါ။"
         				 }, 

                         {
                            "type": "postback",
                            "title": "ရှိပါသည်။",
                            "payload": "ရှိပါသည်။"
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

            }
            //dailyhealthlife end

            else if(userInput == 'ရှိပါသည်။' || userButton == 'ရှိပါသည်။'){
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
                                        "title": "Eat Heathy!!, Live Long!!, Live Strong!!",
                                        "image_url": "https://www.wellnessgarage.ca/uploads/4/8/6/0/48604247/hypertension_orig.png",
                                        "subtitle": "ရောဂါနှင့်ပတ်သက်၍ ကျန်းမာလာစေရန် နေထိုင်နည်းများ",
                                       
                                        "buttons": [
                                            {
                                                "type": "postback",                                               
                                                "title": "သွေးတိုးရောဂါ",
                                                "payload": "သွေးတိုးရောဂါ"
                                            },

                                             
                                        ]
                                    },


                                   {
                                        "title": "Eat Heathy!!, Live Long!!, Live Strong!!",
                                        "image_url": "https://www8.miamidade.gov/resources/images/news/2019-02-26-heart-attack-evergreen.jpg",
                                        "subtitle": "ရောဂါနှင့်ပတ်သက်၍ ကျန်းမာလာစေရန် နေထိုင်နည်းများ",
                                        "default_action": {
                                            "type": "web_url",
                                            "url": "https://petersfancybrownhats.com/view?item=103",
                                            "webview_height_ratio": "tall",
                                        },
                                        "buttons": [
                                            {
                                                "type": "postback",
                                                "title": "နှလုံးရောဂါ",
                                                "payload": "နှလုံးရောဂါ"
                                            }
                                        ]
                                    },

                                    {
                                        "title": "Eat Heathy!!, Live Long!!, Live Strong!!",
                                        "image_url": "https://res.cloudinary.com/grohealth/image/upload/v1581695681/DCUK/Content/causes-of-diabetes.png",
                                        "subtitle": "ရောဂါနှင့်ပတ်သက်၍ ကျန်းမာလာစေရန် နေထိုင်နည်းများ",
                                        "default_action": {
                                            "type": "web_url",
                                            "url": "https://petersfancybrownhats.com/view?item=103",
                                            "webview_height_ratio": "tall",
                                        },
                                        "buttons": [
                                            {
                                                "type": "postback",
                                                "title": "ဆီးချိုသွေးချို",
                                                "payload": "ဆီးချိုသွေးချို"
                                            }
                                        ]
                                    },

                                    {
                                        "title": "Eat Heathy!!, Live Long!!, Live Strong!!",
                                        "image_url": "https://imagevars.gulfnews.com/2019/07/18/190718-asthma-patient_16c05a51ac4_large.jpg",
                                        "subtitle": "ရောဂါနှင့်ပတ်သက်၍ ကျန်းမာလာစေရန် နေထိုင်နည်းများ",
                                        "default_action": {
                                            "type": "web_url",
                                            "url": "https://petersfancybrownhats.com/view?item=103",
                                            "webview_height_ratio": "tall",
                                        },
                                        "buttons": [
                                            {
                                                "type": "postback",
                                                "title": "ပန်းနာရင်ကျပ်",
                                                "payload": "ပန်းနာရင်ကျပ်"
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

            }//diseaseselection end


        else if(userInput == 'သွေးတိုးရောဂါ' || userButton == 'သွေးတိုးရောဂါ')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`\n\n1.ပိုတက်ဆီယမ်နှင့် ဖိုက်ဘာကြွယ်ဝသည့် အစာများ(အာလူး၊ကန်စွန်းဥ၊ခရမ်းချဉ်သီး) စားပါ။.\n\n2.ရေများများသောက်ပါ။.\n\n3.လေ့ကျင့်ခန်းပုံမှန်လုပ်ပါ။\n\n4.အရက် နှင့် ဆေးလိပ် ဖြတ်ပါ။ကဖိန်းများလျှော့ပါ။\n\n5.ဆားကိုအသုံးပြုခြင်းလျှော့ပါ။\n\n6.စိတ်ဖိအား နည်းအောင်နေပါ။\n\n6.ကိုယ်အလေးချိန်ကို သင့်အောင်နေပါ။.`
                    }


            }

            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  


        }


         else if(userInput == 'နှလုံးရောဂါ' || userButton == 'နှလုံးရောဂါ')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`\n\n1.အသီးအနှံများစားပေးပါ။.\n\n2.ကိုယ်လက်လှုပ်ရှားမှု လုပ်ပါ။.\n\n3.ကိုယ်အလေးချိန်ကို သင့်အောင်နေပါ။\n\n4.အရက် နှင့် ဆေးလိပ် ဖြတ်ပါ။\n\n5.ကိုလက်စထရော နှင့် သွေးဖိအားကိုထိမ်းပါ။\n\n6.စိတ်ဖိအား နည်းအောင်နေပါ။`
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//heartdiseaseend

          else if(userInput == 'ဆီးချိုသွေးချို' || userButton == 'ဆီးချိုသွေးချို')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`\n\n1.အဆီ၊ဆား နှင့် ပိုတက်စီယမ်များသော အစာများရှောင်ပါ။.\n\n2.အစာကိုအချိန်မှန်စားပါ။.\n\n3.လေ့ကျင့်ခန်းပုံမှန်လုပ်ပါ။\n\n4.ပရိုတင်းများသောအစာများနှင့် အသီး အရွက်များ စားပါ။\n\n5.သွေးထဲသကြားပါဝင်နှုန်းကို တနေ့ ၃ကြိမ်ခန့်စစ်ပါ။အင်စူလင် သုံးပါကအစာ မစားမီတိုင်း သွေးထဲသကြားပါဝင်နှုန်းကိုစစ်ပါ။ သုံးရမည့်အင်စူလင်ပမာဏ ကိုမှန်းနိုင်ရန်ဖြစ်သည်။\n\n6.သွေးထဲသကြားပါဝင်နှုန်းနည်းပါက ဆရာဝန်နှင့်တိုင်ပင်ပါ။`
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//diabetesend

        else if(userInput == 'ပန်းနာရင်ကျပ်' || userButton == 'ပန်းနာရင်ကျပ်')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`\n\n1.ဆေးလိပ်သောက်ခြင်း၊ဆေးလိပ်ငွေ့ရှုခြင်းတို့မှရှောင်ပါ။.\n\n2.လေ့ကျင့်ခန်းများ၊အားကစားများ တက်နိုင်သလောက်လုပ်ပါ။.\n\n3.စိတ်ကျမ်းမာမှုသည် ရောဂါအပေါ်သက်ရောက်မှု ရှိသည်။\n\n4.ဆရာဝန်ပေးထားသော ဆေးများပုံမှန်သောက်ပါ။\n\n5.ဗိုက်တာမင် ဒီ နှင့် မက်ဂနီဆီယမ် များသောအစာများ စားပါ။`
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//asthmaend

         else if(userInput == 'မရှိပါ။' || userButton == 'မရှိပါ။')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`ဒါဆိုရင်ဆက်လက်ပြီး ကျန်းမာစေရန် ဒီအချက်များကိုလိုက်နာပါ။\n\n1.တနေ့ကို ကိုယ်လက်လှုပ်ရှားမှုကိုအနည်းဆုံး မိနစ်၃၀ခန့် လုပ်ဆောင်ပါ။.\n\n2.နေရောင်ဖြင့် ထိတွေ့ပါ။.\n\n3ဆား နဲ့ သကြားကို လျော့သုံးပါ။\n\n4.စားသည့် အချိန် နှင့် ပမာဏကိုပုံမှန်ထားပါ။အစာအုပ်စု ၃စုလုံးစုံအောင်စားပါ။\n\n5.ရေကို အနည်းဆုံး ၂လီတာ သောက်ပါ။\n\n6,ညတိုင်း ၁၀ နာရီခန့်တွင်အိပ်ရာ၀င်ပါ။ တစ်နေ့အိပ်ချိန် ၇ နာရီမှ ၉နာရီ အတွင်းရှိပါစေ။`
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//normalhealthned


        else if(userInput == 'သာမန်ကုသမှုနည်းလမ်းများ' || userButton == 'သာမန်ကုသမှုနည်းလမ်းများ'){
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
                                                "title": "အဆိပ်သင့်ဒဏ်ရာမျာ:",
                                                "payload": "အဆိပ်သင့်ဒဏ်ရာမျာ:"
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
                        "text":`\n\n1.ဒဏ်ရာကို ရေစိမ်ခြင်း၊ရေစိုဝတ်နှင့်အုံပေးခြင်းပြုလုပ်ပါ။ရေခဲနှင့်တိုက်ရိုက်ထိ ခြင်းမပြုရ\n\n2.မီးလောင်ရာနေရာကိုပိုးသတ်ထားသောပတ်တီးသို့မဟုတ်သန့်ရှင်းသောအဝတ်ဖြင့်ဖုံးထားပါ။စောင်သို့မဟုတ်မျက်နှာသုတ်ပုဝါကိုမသုံးပါနှင့်။ချည်မျှင်များမီးလောင်ဒဏ်ရာကိုကပ်သွားနိုင်သည်။.\n\n3.ဆရာဝန်ညွှန်ကြားထားသည့် လိမ်းဆေးများအသုံးပြုနိုင်သည်။ သွားတိုက်ဆေးသုံးခြင်းကိုရှောင်ကြဉ်ပါ`
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        } //electriclaburn end

    else if(userInput == 'ဓာတုလောင်ကျွမ်းဒဏ်ရာ' || userButton == 'ဓာတုလောင်ကျွမ်းဒဏ်ရာ')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`\n\n1.အသားပေါ်ရှိဓာတုအရာများကို ရေအေးဖြင့် ၁၀မိနစ်ခန့် လောင်းချပေးပါ။ ဓာတုအရာများအစိုမဟုတ်ပါက လက်အိတ် (တဆင့်ခံအရာတခုခု) သုံးပြီးဖယ်ရှားပါ။\n\n2.ဓာတုအရာဖြင့်ထိထားအဝတ်အစားများသို့မဟုတ်ဆက်စပ်ပစ္စည်းများကိုဖယ်ရှားပါ.\n\n3.မီးလောင်ရာနေရာကိုပိုးသတ်ထားသောပတ်တီးသို့မဟုတ်သန့်ရှင်းသောအဝတ်ဖြင့်ဖုံးထားပါ။ဒဏ်ရာကို အတင်းဖိအားမဖြစ်စေရန် ပတ်တီးကို တင်းကြပ်စွားမစီးပါနှင့်\n\n4.ရေဆေးပြီးသည့်‌နောက် ဒဏ်ရာသည် ဆက်လက်၍ အပူလောင်နေသေးပါက ထပ်မံ၍ ရေဆေးပါ.`
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        } //chemcialburn end

         else if(userInput == 'အဆိပ်သင့်ဒဏ်ရာမျာ:' || userButton == 'အဆိပ်သင့်ဒဏ်ရာမျာ:'){
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
                                                "title": "ဆေးအလွံအကျွံသုံးစွဲမှု",
                                                "payload": "ဆေးအလွံအကျွံသုံးစွဲမှု"
                                            },
                                             {
                                                "type": "postback",                                               
                                                "title": "ဆေးအလွံအကျွံသုံးစွဲမှုအ‌ကြောင်:",
                                                "payload": "ဆေးအလွံအကျွံသုံးစွဲမှုအ‌ကြောင်:"
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
                                                "title": "မျက်လုံးထဲသို့အဆိပ်ဝင်",
                                                "payload": "မျက်လုံးထဲသို့အဆိပ်ဝင်"
                                            },
                                             {
                                                "type": "postback",                                               
                                                "title": "မျက်လုံးထဲသို့အဆိပ်ဝင်အ‌ကြောင်:",
                                                "payload": "မျက်လုံးထဲသို့အဆိပ်ဝင်အ‌ကြောင်:"
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
                                                "title": "ပိုးကောင်အဆိပ်",
                                                "payload": "ပိုးကောင်အဆိပ်"
                                            },
                                             {
                                                "type": "postback",                                               
                                                "title": "ပိုးကောင်အဆိပ်အ‌ကြောင်:",
                                                "payload": "ပိုးကောင်အဆိပ်အ‌ကြောင်:"
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

        else if(userInput == 'ဆေးအလွံအကျွံသုံးစွဲမှု' || userButton == 'ဆေးအလွံအကျွံသုံးစွဲမှု')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`\n\n1.ပထမဦးစွာ လူနာ၏ကိုယ်ကို ဘယ်ဘက်သို့စောင်ူထားပေးပ.\n\n2.လူနာအသက်ရှူရ အဆင်‌ပြေအောင် ခေါင်းကိုနောက်သို့စောင်း၍ မေးစေ့ကိုကိုင်ထားပေးပါ.\n\n3.အစာအိမ်နေရာကို ဖိ၍ မချေဖျက်ရသေးသည့်ဆေးများ  ပြန်ထွက်အောင်လုပ်ပါ.\n\n4.အပူပေးထားသည့်မီးသွေး (သို့) activated charcoal ဆေးပြားများကို လိုအပ်ပါကလူနာကိုပေးပါ။ ကိုယ်ထဲရှိဆေးများသွေးထဲသို့မရောက်အောင်တားစီးပေးသည်။.\n\n5.ဆေးဘူးများကိုဆေးရုံသို့ယူလာပါ။.`
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//drugtoxicity end

    else if(userInput == 'မျက်လုံးထဲသို့အဆိပ်ဝင်' || userButton == 'မျက်လုံးထဲသို့အဆိပ်ဝင်')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`\n\n1.မျက်လုံးကိုရေနွေးဖြင့်၁၅မိနစ်ခန့်ဆေးပါ။မျက်လုံးကို သန့်ရှင်းသော အဝတ်ဖြင့်သန့်စင်ပါ။.\n\n2.လူနာ၏မျက်လုံးကိုချဲ့လို့ရသလောက်ချဲ့ထားပါ။.\n\n3.မျက်လုံးကိုလက်နဲ့ပွတ် ခြင်း၊ ပတ်တီးပတ်ခြင်းမပြုရ။.\n\n4.မျက်လုံးထဲသို့ အလင်းဝင်နဲရန် နေကာမျက်မှန်တပ်ပါ\n\n5.မျက်လုံးထဲသို့ ဝင်သွားသည့်ဓာတုအဆိပ်အား ဆရာဝန်များသိနိုင်အောင်ကြိုးစားပါ.`
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//poisonintheeye end

    else if(userInput == 'ပိုးကောင်အဆိပ်' || userButton == 'ပိုးကောင်အဆိပ်')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`\n\n1.ဒဏ်ရာပေါ်တွင်ပိုးကောင်၏အဆိပ်အပိုင်းရှိသေးပါက ဖယ်ရှားပါ။\n\n2.ဒဏ်ရာကိုရေဖြင့်ဆေးပါ.\n\n3.ဒဏ်ရာကိုရေခဲ သို့ ရေခဲထုပ်ဖြင့် ၁၀မိနစ်ခန့် ဖိထားပါ။\n\n4.ဒဏ်ရာကိုကုတ်ခြင်း ဖဲ့ခြင်းမလုပ်ရ.`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        } //bugbite end

    else if(userInput == 'အရိုးဒဏ်ရာ' || userButton == 'အရိုးဒဏ်ရာ'){
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
                                                "title": "အရိုးကျိုးခြင်:",
                                                "payload": "အရိုးကျိုးခြင်:"
                                            },
                                            {
                                                "type": "postback",                                               
                                                "title": "အရိုးကျိုးခြင်:အ‌ကြောင်:",
                                                "payload": "အရိုးကျိုးခြင်:အ‌ကြောင်:"
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
                                                "title": "အဆစ်လွဲ",
                                                "payload": "အဆစ်လွဲ"
                                            },
                                             {
                                                "type": "postback",                                               
                                                "title": "အဆစ်လွဲခြင်:အ‌ကြောင်:",
                                                "payload": "အဆစ်လွဲခြင်:အ‌ကြောင်:"
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

    else if(userInput == 'အရိုးကျိုးခြင်:' || userButton == 'အရိုးကျိုးခြင်:')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`\n\n1.ဒဏ်ရာသွေးထွက်နေပါက ပိုးသတ်ထားသည့်ပတ်တီး၊ သန့်ရှင်းသောအဝတ်ကို သုံး၍ပတ်ထားပါ။ ဒဏ်ရာရသည့်နေရာကို အ‌ပေါ်သို့‌မြှောက်ထားပါ။\n\n2.အရိုးကြိုးသည့်နေရာမှာ လည်ပင်း သို့ ခါးဖြစ်ပါက လူနာကို တတ်နိုင်သမျှမလှုပ်ရှားစေပါနှင့်။လက် သို့ ‌ခြေဖြစ်ပါက ပတ်တီးအသုံးပြု၍လှုပ်မရအောင်လုပ်ပါ။\n\n3.ပြီးပါက ရေခဲ ကို ဒဏ်ရာရှိရာပေါ်သို့ ၁၀မိနစ်ခန့်ဖိထားပေးပါ။\n\n5.လူနာ အသက်ရှူရခက်နေပါက CPR (အရေးပေါ်ကုသမှုတွင်ပြထား) လုပ်ဆောင်ပါ။`
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//brokenbone end

    else if(userInput == 'အဆစ်လွဲ' || userButton == 'အဆစ်လွဲ')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`\n\n1.အဆစ်လွဲသည့်နေရာကို ဖိခြင်း၊ နေရာရွေ့ခြင်းမပြုပါနှင့်။ဒီအတိုင်းထားပါ။သွေး‌ကြောများပေါက်ခြင်းဖြစ်နိုင်သည်။.\n\n2.အဝတ်ထဲသို့ရေခဲ ထည့်ပတ်၍ ဒဏ်ရာအနီးတဝိုက်ကိုဖိထားပေးပါ။\n\nလိုအပ်ပါက အကိုက်အခဲပျောက်ဆေးသုံးပါ။.`
                    }


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        } //bonedisclocation end

       

    else if(userInput == 'အရေးပေါ် ကုသမှု' || userButton == 'အရေးပေါ် ကုသမှု')
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
                            "title": "ရေနစ်ခြင်း",
                            "payload": "ရေနစ်ခြင်း"
                        },

                         {
                            "type": "postback",
                            "title": "မြွေကိုက်ဒဏ်ရာ",
                            "payload": "မြွေကိုက်ဒဏ်ရာ"
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


          else if(userInput == 'နှာခေါင်းသွေးထွက်ဒဏ်ရာအကြောင်:' || userButton == 'နှာခေါင်းသွေးထွက်ဒဏ်ရာအကြောင်:')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`နှာခေါင်းသွေ:ထွက်ခြင်:အများဆုံးဖြစ်ရသည့်အကြောင်းအရင်းမှာ ရာသီဥတု ရုတ်တရက်‌ပြောင်းလဲခြင်း၊ အတွင်းဒဏ်ရာတို့‌ကြောင့်ဖြစ်သည်။အရမ်းစိုးရိမ်ဖွယ်မရှိသော်လည်းသွေးများ အထဲသို့ပြန်ဝင်ပါက အသက်ရှုလမ်း‌ကြောင်းပိတ်မိနိုင်သည်။`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//about nose bleed end

         else if(userInput == 'ပြင်းထန်သွေးထွက်ဒဏ်ရာအကြောင်:' || userButton == 'ပြင်းထန်သွေးထွက်ဒဏ်ရာအကြောင်:')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`ပြင်းထန်သွေးထွက်ဒဏ်ရာဆိုသည်မှာ ဒဏ်ရာမှသွေးအထွက်များကာ သွေးတိတ်ရန်မလုပ်နိုင်သော ဒဏ်ရာဖြစ်သည်။ စိုးရိမ်ဖွယ်ရှိသော ဒဏ်ရာဖြစ်သည်၊အသက်ဆုံးရှုံးနိုင်သည်။.`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//about over bleeding end

         else if(userInput == 'ပုံမှန်သွေးထွက်အနာအကြောင်:' || userButton == 'ပုံမှန်သွေးထွက်အနာအကြောင်:')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`ပုံမှန်သွေးထွက်အနာသည် သွေးအနည်းငယ်ထွက်‌သော သာမန်ဒဏ်ရာဖြစ်သည်။ အသက်ကိုမထိခိုက်နိုင်သော်လည်း ပိုးဝင် ခြင်းဖြစ်နိုင်သည်။`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//about bleeding wound end

         else if(userInput == 'ရေနွေးငွေ့လောင်ဒဏ်ရာအကြောင်:' || userButton == 'ရေနွေးငွေ့လောင်ဒဏ်ရာအကြောင်:')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`ရေနွေးငွေ့လောင်ခြင်းဆိုသည်မှာ ရေနွေး သို့ ရေနွေးငွေ့‌ကြောင့်လောင်ခြင်းဖြစ်သည်။ လောင်ကျွမ်းမှုအပေါ်မူတည်၍ ဒဏ်ရာပြင်းထန်မှုကွာခြားသည်။`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//steamburn end

        else if(userInput == 'လျှပ်စစ်လောင်ဒဏ်ရာအကြောင်:' || userButton == 'လျှပ်စစ်လောင်ဒဏ်ရာအကြောင်:')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`လျှပ်စစ်လောင်ကျွမ်းခြင်းဆိုသည်မှာ အသား အတွင်းသို့လျှပ်စစ် ပြင်းထန်စွာစီး၍ ဖြစ်ပေါ်လာသော လောင်ကျွမ်းမှု ဖြစ်သည်။လောင်ကျွမ်းမှုအပေါ်မူတည်၍ ဒဏ်ရာပြင်းထန်မှုကွာခြားသည်။`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//about electricalburn end

        else if(userInput == 'ဓာတုလောင်ကျွမ်းဒဏ်ရာအကြောင်:' || userButton == 'ဓာတုလောင်ကျွမ်းဒဏ်ရာအကြောင်:')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`ဓာတုလောင်ကျွမ်းခြင်းဆိုသည်မှာ အက်စစ် သို့မဟုတ် မိတ်ကပ် ကဲ့သို့ ဓာတုအရာများ အသားနှင့်ထိမိခြင်းမှဖြစ်ပေါ်လာခြင်းဖြစ်သည်။ လောင်ကျွမ်းမှုအပေါ်မူတည်၍ ဒဏ်ရာပြင်းထန်မှုကွာခြားသည်။`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//about chemical burn end

        else if(userInput == 'ဆေးအလွံအကျွံသုံးစွဲမှုအ‌ကြောင်:' || userButton == 'ဆေးအလွံအကျွံသုံးစွဲမှုအ‌ကြောင်:')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`ဆေးအလွန်အကျွံသုံးစွဲမှုဆိုသည်မှာ ဓာတ်မတဲ့သော ဆေး သို့မဟုတ် ဆေးအလွန်အကျွံ သုံးစွဲမှု‌ကြောင့်ဖြစ်ခြင်း ဖြစ်သည်။ ကုသမှု အမြန်မခံယူပါက အသက်ဆုံရှုံးနိုင်သည်။`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//about drug toxicity end

        else if(userInput == 'မျက်လုံးထဲသို့အဆိပ်ဝင်အ‌ကြောင်:' || userButton == 'မျက်လုံးထဲသို့အဆိပ်ဝင်အ‌ကြောင်:')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`မျက်လုံးထဲသို့အဆိပ်ဝင်ခြင်းဆိုသည်မှာ ဓာတုအငွေ့၊အရည်၊အမှုန်များ မျက်လုံးထဲသို့ဝင်ခြင်း‌ကြောင့်ဖြစ်သည်။ချက်ချင်းကုသမှုမခံယူပါက ဒဏ်ရာပြင်းနိုင်သည်။`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//about poisonintheeye end

            else if(userInput == 'ပိုးကောင်အဆိပ်အ‌ကြောင်:' || userButton == 'ပိုးကောင်အဆိပ်အ‌ကြောင်:')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`ပိုးကောင်အဆိပ်ဆိုသည်မှာ အဆိပ်ရိသော အကောင်တစ်ကောင်ကကိုက်ခြင်း‌ကြောင့်ဖြစ်သည်။ပုံမှန်အားဖြင့်ဒဏ်ရာပြင်းထန်မှုမရှိပါ။`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//about bug bite end

         else if(userInput == 'အရိုးကျိုးခြင်:အ‌ကြောင်:' || userButton == 'အရိုးကျိုးခြင်:အ‌ကြောင်:')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`အရိုးကျိုးခြင်းဆိုသည်မှာ ‌ချောလဲခြင်း သို့ တခုခုနှင့်ပြင်းထန်စွာရိုက်မိသောကြောင့် အတွင်းရှိအရိုးများ ကျိူးသွားခြင်းဖြစ်သည်။ ဒဏ်ရာပြင်းထန်နိုင်သောလည်း အသက်ကိုမထိခိုက်နိုင်။`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })  
            

        }//about brokenbone end

            else if(userInput == 'အဆစ်လွဲခြင်:အ‌ကြောင်:' || userButton == 'အဆစ်လွဲခြင်:အ‌ကြောင်:')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`အဆစ်လွဲခြင်းဆိုသည်မှာ အရိုး ၂ ခုစုံရာနေရာတွင် အရိုးတခုသည် ပုံပျက်ခြင်း၊နေရာရွေ့သွားခြင်းကြောင့်ဖြစ်သည်။ ပုံမှန်အားဖြင့် ဒဏ်ရာမပြင်းပါ၊ အသက်လည်းမထိခိုက်နိုင်ပါ။`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })
            

        }//about bonedislocaton end

         else if(userInput == 'ရေနစ်ခြင်း' || userButton == 'ရေနစ်ခြင်း')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`1.လူနာကိုနှိုးကြည့်ပါ။.\n\n2.လူနာကိုလှဲ၍ အသက်ရှူရလွယ်ကူစေရန် ခေါင်းကိုမော့၍ မေးစေ့ကိုထိန်းထားပေးပါ.\n\n3.နှာခေါင်းကိုညှစ်ထား၍ လူနာ၏ခေါင်းကိုမော့ကာ ပါးစပ်အတွင်းသို့ လေများသွင်းပေးပါ။ လေတခါသွင်းလျှင် ၁ စက်ကန့်မျှ ကြာပါစေ\n\n4.CPR ကို ၁မိနစ်ခန့်လုပ်ဆောင်ပါ `
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })
            

        }//drowning end

         else if(userInput == 'မြွေကိုက်ဒဏ်ရာ' || userButton == 'မြွေကိုက်ဒဏ်ရာ')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`1လူနာကိုစိတ်ညိမ်အောင်ထား၍ မလှုပ်ရှားအောင်လုပ်ပါ။မြွေဆိပ်သည်သွေးထဲသို့တိုက်ရိုက်ရောက်သည်မဟုတ်သော‌ကြောင့်၊မလှုပ်ရှားပါက အဆိပ်သည်သွေးထဲသို့ရောက်ချိန်ကြာနိုင်သည်။\n\n2.မြွေကိုရှာ‌ဖွေရန်၊ဖမ်းရန်ခက်ခဲပါက မကြိုးစားပါနှင့်။ ဒဏ်ရာရှိသူပိုမိုများလာနိုင်သည်။\n\n3.ပလက်စတစ်အပတ် ကိုအသုံးပြု၍မြွေကိုက်ဒဏ်ရာကိုပတ်ပေးပါ။.\n\n4.ပတ်တီးဖြင့် ဒဏ်ရာကိုပတ်ပေးပါ.\n\n5.နောက်ပတ်တီးကို  ‌ခြေချောင်း လက်ချောင်းမှစ၍ဒဏ်ရာ၏အပေါ်ပိုင်းအထိပတ်ပါ.\n\n6.ပတ်တီးမရှိပါက တီရှပ် သို့ အထည်သားကဲ့သို့ ဆွဲဆန့်၍ရသည့် အရာများကိုအသုံးပြုနိုင်သည်\n\n7.တုတ်ချောင်းကဲ့သို့အရာများကိုသုံးပြု၍ မြွေကိုက်ဒဏ်ရာကိုလှုပ်မရအောင်လုပ်ပါ။\n\n8.ဒဏ်ရာကို ရေဆေးခြင်း၊ အဆိပ်ကိုစုတ်ခြင်း များမလုပ်ရ `
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
                        "text":`1.လက်ကိုနေရာချပါ။ လူနာကို ကြမ်းပြင်ပေါ်၌ လှဲထားပါ။ လူနာဘေးတွင်ဒူးထောက်ကာ လက်ဖနောင့်ကို လူနာ၏ရင်ဘက်အလယ်တွင်ထားပါ။\n\n2.လက်တဖက်ပေါ်သို့ တဖက်တင်ပါ။ လက်ကိုအ‌ဖြောင့်ထားပါ။လက်ချောင်းများအနည်းငယ်ဖော့ထားပါ။\n\n3.ကုသသူက ကိုယ်ကို ရှေ့သို့ကိုင်းပါ။ ကုသသူ၏ ပုခုံးသည် လူနာ၏ရင်ဘက်နှင့်တသားတည်းဖြစ်ရမည်။ရင်ဘက်ကိုဖိပါ။ရင်ကို ၂လက်မခန့် နိမ့်သွားအောင်ဖိပါ။\n\n4.ဖိပြီးပါက လက်၏ဖိအားကိုလျှော့ပါ၊လက်ကိုမဖယ်လိုက်ပါနှင့်။\n\n5.လူနာအသက်ရှူရ အဆင်‌ပြေအောင် ခေါင်းကိုနောက်သို့စောင်း၍ မေးစေ့ကိုကိုင်ထားပေးပါ\n\n6.နှာခေါင်းကိုညှစ်ထား၍ လူနာ၏ခေါင်းကိုမော့ကာ ပါးစပ်အတွင်းသို့ လေများသွင်းပေးပါ။\n\n7.ရင်ဘက်ဖောင်းလာပါက လေသွင်းပေးသည်ကိုရပ်၍ ရင်ဘက်ပြန်ကျအောင်စောင့်ပါ။\n\n7.`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })
            

       	 }

       	  else if(userInput == 'ဆေးဝယ်ရန်' || userButton == 'ဆေးဝယ်ရန်')
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
           				 "type":"postback",
           				 "title":"First-aid kit ဝယ်ရန်",
           				 "payload":"firstaid"
         				 }

                      

                         
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

                else if(userInput == 'firstaid' || userButton == 'firstaid')
             {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                   "message": { 
                   	 "text":`ပါဝင်သည်များမှာ \n\n 1.ပိုးသတ်ထားသောပတ်တီး \n\n2.ပလက်စတာ \n\n3.ကပ်ကြေ \n\n4.ပိုးကောင်ကိုက်ဒဏ်ရာအတွက်လိမ်းဆေး \n\n5.အကိုက်အခဲ‌ပျောက်ဆေ:\n\n6.မျက်လုံးဆေးရန်အရည်\n\n7.ညှပ်\n\n8.ပိုးသတ်ဆေးအရည်\n\n9.ဓာတ်မတည့်ခြင်းကြောင့်ဖြစ်သောရောဂါအတွက်ဆေ:\n\n10.အရေးပေါ်ဖုန်းနံပါတ်များပါသည့်စာအုပ်
\n\n11.သာမိုမီတာ\n\n\nဈေးနှုန်: = 15000 ks`,
					"quick_replies":[
				      {
				        "content_type":"text",
				        "title":"Buy",
				        "payload":"buy-first-aid",
				        
				      },
				    ]              
                			

              },




            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response);
                }).fail(error => {
                    console.log(error)
                })     

            
            }

            else if(userQuickReply == 'buy-first-aid' || userQuickReply == "edit-data"){
            	let message = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                   "message": { 
                   	 "text":`နာမည်ရေးပါ။`
					}
            	}

            	questions.name = true;

            	requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, message
                ).then(response => {
                    console.log(response);
                }).fail(error => {
                    console.log(error)
                })
            }

            else if(userInput && questions.name == true){
            	userAnswers.name = userInput;
            	questions.name = false;

            	let message = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                   "message": { 
                   	 "text":`ဖုန်းနံပါတ်ရေးပါ`
					}
            	}

            	questions.phone = true;

            	requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, message
                ).then(response => {
                    console.log(response);
                }).fail(error => {
                    console.log(error)
                })

            	console.log("USER",userAnswers);
            }

            else if(userInput && questions.phone == true){
            	userAnswers.phone = userInput;
            	questions.phone = false;

            	let message = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                   "message": { 
                   	 "text":`လိပ်စာရေးပါ။`
					}
            	}

            	questions.address = true;

            	requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, message
                ).then(response => {
                    console.log(response);
                }).fail(error => {
                    console.log(error)
                })

            	console.log("USER",userAnswers);
            }


            else if(userInput && questions.address == true){
            	userAnswers.address = userInput;
            	questions.address = false;

            	let message = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                   "message": { 
                   	 "text":`နာမည် ${userAnswers.name},ဖုန်းနံပါတ် ${userAnswers.phone}, လိပ်စာ ${userAnswers.address}. `,
                   	 "quick_replies":[
				      {
				        "content_type":"text",
				        "title":"Correct",
				        "payload":"save-data",
				        
				      },
				      {
				        "content_type":"text",
				        "title":"Edit",
				        "payload":"edit-data",
				        
				      },
				      {
				        "content_type":"text",
				        "title":"No",
				        "payload":"no-save-data",
				        
				      }
				    ]
					}
            	}            	

            	requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, message
                ).then(response => {
                    console.log(response);
                }).fail(error => {
                    console.log(error)
                })

            	console.log("USER",userAnswers);
            }


            else if(userQuickReply == "save-data"){
            	let addDoc = db.collection("orders").add(userAnswers).then(ref=>{
                    console.log("OK");
                }).catch(e=>{
                    console.log('error',e);
                });

            	console.log("USER",userAnswers);
            }

                 else if(userInput == "term" || userButton == "term")
          {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`1.ပြထားသောဆေးကုသနည်းများမှာ ခဏတာ သက်သာစေရန်သာဖြစ်သည်။ ပြထားငည့်အတိုင်းကုသပြီးပါက ဆရာဝန်နှင့်ထပ်ပြရန်လိုအပ်ပါသည်။\n\n2.First-aid kit  တွင်ပါသောဆေးများမှာ ဘေးဥပဒ် မဖြစ်စေရန် အာမခံသည်။`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })
            

         }

         else if(userInput == "about" || userButton == "about")
          {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`Online Firt-aid သည်လူအများ၏ကျမ်းမာရေးအတွက်ဦးတည်၍ထုပ်ထားခြင်းဖြသသည်။ အရေးပေါ်ကိစ္စများနှင့် နေ့စဉ်ကြုံတွေ့နိုင်သောဒဏ်ရာများအတွက် အလွယ်တကူကုသနိုင်သောနည်းလမ်းများကိုဖော်ပြထားပါသည်။`
                    },
                


            }
            requestify.post(`https://graph.facebook.com/v5.0/me/messages?access_token=${pageaccesstoken}`, buttonMesage
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })
            

         }

         else if(userInput == "Q&A" || userButton == "Q&A")
          {
                let buttonMesage = {
                    "recipient": {
                        "id": webhook_event.sender.id
                    },
                    "message":{
                        "text":`Please contact me here if you have suggestion or feeback. noelkghtet@gmail.com`
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


// menu function

function setupPersistentMenu(res){
        var messageData = { 
            "persistent_menu":[
                {
                  "locale":"default",
                  "composer_input_disabled":false,
                  "call_to_actions":
                [
                      {
                        "title":"Contact Us",
                        "type":"nested",
                        "call_to_actions":
                        [
                            {
                              "title":"Terms & Conditions",
                              "type":"postback",
                              "payload":"term"
                            },
                            {
                              "title":"About us",
                              "type":"postback",
                              "payload":"about"
                            },
                             {
                        "type": "postback",
                        "title": "ဆေးဝယ်ရန်",
                        "payload": "firstaid"
                      }

                      {
                        "type": "postback",
                        "title": "Q & A",
                        "payload": "Q&A"
                      }
                        ]
                      }
                      
                      

                    
                ]
            }
          ]          
        };
        // Start the request
        requestify.post(`https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${pageaccesstoken}`, messageData
                ).then(response => {
                    console.log(response)
                }).fail(error => {
                    console.log(error)
                })
            
    }

    //end of menubar


   