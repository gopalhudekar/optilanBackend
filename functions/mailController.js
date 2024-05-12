const express = require("express");
var router = express.Router();
"use strict";

const nodemailer = require("nodemailer");




var path = require('path');

const transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",  
    secure: true,
    secureConnection: false, // TLS requires secureConnection to be false
    tls: {
        ciphers:'SSLv3'
    },
    requireTLS:true,
    port: 465,
    auth: {
        user: 'enquiry@optilan.in',
        pass: 'Optilan#321#'
    }
});



const contactEnquiryData = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enquiry Email</title>
    <style>
        /* Reset CSS */
        body, html {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            color: #333;
        }
        img {
            max-width: 100%;
            height: auto;
        }
        /* Email Body */
        .email-body {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #fa6a6a;
        }
        .email-header {
            text-align: center;
            margin-bottom: 20px;
        }
        .email-content {
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
        }
        .email-footer {
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-body">
        <div class="email-header">
            <h1>Optilan</h1>
        </div>
        <div class="email-content">
            <p>Hi Team</p>
            <p>There is equiry generated on our optilan website, Below is the detail of enquiry.</p>
             <p> Name :  <%=data.name%> </p>
  <p> Email :  <%=data.email%> </p>
  <p> Mobile No :  <%=data.mobileno%> </p
  <p> Subject :  <%=data.subject%> </p>
  <p> Message : <%=data.message%> </p>
  <p> Date :  <%=data.date%> </p>
        </div>
        <div class="email-footer">
            <p>This email is generated from the Optilan website.</p>
            <a href='https://us-central1-optilan-645f0.cloudfunctions.net/api/' target="_blank"
	style="background: #180e3a;
    padding: 5px;
    border-radius: 5px;
    color: white;
    cursor: pointer;
}">View All Enquiries</a>
        </div>
    </div>
</body>
</html>
`


module.exports.newContactEnquiry = async function (emailData) {

    let contactEnquiry = contactEnquiryData;
    return new Promise((resolve, reject) => {
        contactEnquiry = contactEnquiry.replace('<%=data.Hi%>', 'Hi');
        contactEnquiry = contactEnquiry.replace('<%=data.name%>', emailData.name);
        contactEnquiry = contactEnquiry.replace('<%=data.email%>', emailData.email);
        contactEnquiry = contactEnquiry.replace('<%=data.mobileno%>', emailData.mobileNo);
        contactEnquiry = contactEnquiry.replace('<%=data.message%>', emailData.message);
        contactEnquiry = contactEnquiry.replace('<%=data.subject%>', emailData.subject);
        contactEnquiry = contactEnquiry.replace('<%=data.date%>', emailData.date);
        let mailOption = {
            from: 'enquiry@optilan.in', // sender address
            to: 'info@optilan.in', // list of receivers
            subject: "New Enquiry (" + emailData.message + ")", // Subject line
            html: contactEnquiry
        } 

        transporter.sendMail(mailOption).then((info) => {
            let message = "Message sent: " + info.messageId + "Preview URL: " + nodemailer.getTestMessageUrl(info);
            let resolveData = {
                message: message
            }
            resolve(resolveData)

        }, (err) => {
            console.log('email sent err : ', err)
            reject(err)
        });

        //   }})

    });
}


// module.exports = router;
// module.exports = mail;
