import * as messaging from "messaging";
import { settingsStorage } from "settings";


messaging.peerSocket.onmessage = function(evt) {
  //Call our send message function to do  fetch call to a webservice with this data
  SendSMS(JSON.stringify(evt.data));
}

//the below variables are needed if you want to use the easylink sms soap message below:
//Please be aware that this is a pais service for which you need to register and buy a contract
//The principle of submitting the SOAP request and getting the Response in your FitBit companion
//is the same for any SOAP webservice though.
let url = 'https://easylinkendpointurl';
let username = 'OPENTEXTEASYLINKUID';
let password = 'PASSWORD';

function SendSMS(heartrate)  {
        console.log("in SendSMS: " + heartrate);
        var yourHeartRate = "Your heart rate is too high: " + heartrate;
        const headers = new Headers();

        headers.append('Content-Type', 'text/xml');
        headers.append('SOAPAction', 'basicInvoke');
        headers.append('Authorization', 'Basic ' + username + ":" + password);


        let soapmessage = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://ws.easylink.com/RequestResponse/2011/01" xmlns:ns1="http://ws.easylink.com/JobSubmit/2011/01">' + 
   '<soapenv:Header>' +
      '<ns:Request>' +
         '<ns:SenderKey>?</ns:SenderKey>' +
         '<ns:ReceiverKey>https://messaging.easylink.com/soap/sync</ns:ReceiverKey>' +
          '<ns:Authentication>' +
           '<ns:XDDSAuth>' +
           '<ns:RequesterID aliasType="?">' + username + '</ns:RequesterID>' +
            '<ns:Password>' + password + '</ns:Password>' +
            '</ns:XDDSAuth>' +
         '</ns:Authentication>' +
      '</ns:Request>' +
   '</soapenv:Header>' +
   '<soapenv:Body>' +
		   '<JobSubmitRequest xmlns="http://ws.easylink.com/JobSubmit/2011/01">' +
				'<Message>' +
				'<JobOptions>' +
					'<SmsOptions/>' +
				'</JobOptions>' +
				'<Destinations>' +
					'<DeliveryItemGeneric type="sms">' +
						'<Address>003312345678</Address>' +
					'</DeliveryItemGeneric>' +
				'</Destinations>' +
				'<Reports>' +
					'<DeliveryReport>' +
					'<DeliveryReportType>none</DeliveryReportType>' +
					'</DeliveryReport>' +
				'</Reports>' +
				'<Contents>' +
					'<Part>' +
					'<Document>' +
					'<DocType>text</DocType>' +
					'<DocData format="text">' + yourHeartRate + '</DocData>' +
					'</Document>' +
					'<Treatment>body</Treatment>' +
					'</Part>' +
				'</Contents>' +
				'</Message>' +
		'</JobSubmitRequest>' +
   '</soapenv:Body>' +
'</soapenv:Envelope>';

        console.log('about to send ' + soapmessage);

        fetch(url, {
            body: soapmessage,
            method: 'POST',
            mode: 'cors',
            headers: headers,
            credentials: 'include'
        })
            .then(response => {
              response.text().then(text => {
              // handle response content
                  console.log("Response: " + text);
        })
      })
            .catch(function(error) {
                console.log(error);
            });
    }
