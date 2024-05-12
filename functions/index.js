
const functions = require('firebase-functions');
const express = require('express');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path')
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const mailController = require("./mailController");
var cors = require('cors');
//db initialize
admin.initializeApp();
const db = admin.firestore()

const enquiries = "enquiries";

const app = express();
app.use('/', express.static(path.join(__dirname, 'templates')))
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
// Define your routes
const users = [
    {
        username: 'admin',
        passwordHash: 'optilan#(123)' // password: "password1"
    },
    {
        username: 'user2',
        passwordHash: '$2b$10$fC18mRc1W/zMSSae8FRN/OnA40w2AUXFZI7ZbBD3OVmO17BQwRRCy' // password: "password2"
    }
];

function findUserByUsername(username) {
    return users.find(user => user.username === username);
}
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '/templates/login.html'));

    // console.log("var url = req.url;", `${req.protocol}://${req.get('host')}${req.originalUrl}`)
    //    await fs.readFile('./templates/login.html', 'utf8', (err, data) => {
    //         if (err) {
    //             return res.status(500).send('Error reading file');
    //         }
    //         const modifiedData = data.replace('{{urlpath}}', '/api/');
    //         res.send(modifiedData);
    //     });
});

app.post('/', async (req, res) => {
    const { username, password } = req.body;

    // Find user by username
    const user = findUserByUsername(username);
    console.log("user : ", user);

    if (!user || !(password == user.passwordHash)) {
         res.sendFile(path.join(__dirname, '/templates/authfail.html'));
    } else {
        // Authentication successful
        try {
            const userQuerySnapshot = await db.collection('enquiries').orderBy('date', 'desc').limit(150).get();
            functions.logger.info("userQuerySnapshot : ", userQuerySnapshot)
            const users = [];
            let html = `<!DOCTYPE html><html><head><title>Optilan Website Enquiries</title>
                    <style>
                        table {
                            border-collapse: collapse;
                            width: 100%;
                        }
                        th{
                            background: green;
                        }
                        th, td {
                            border: 1px solid #dddddd;
                            text-align: left;
                            padding: 8px;
                        }
                        .scrollable {
                            max-height: 200px; /* Adjust this value as needed */
                            overflow: auto;
                        }
                    </style>
               </head><body>`;
            html += '<h1 style="text-align:center">Optilan Website Enquiries</h1>';
            html += `<table>
                  <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Subject</th>
                  <th>Message</th>
                  </tr>`;

            userQuerySnapshot.forEach(
                (doc) => {
                    let user = {
                        id: doc.id,
                        data: doc.data()
                    }
                    users.push(user);

                    html += `<tr>
                        <td>
                            <div class="scrollable">${formatDate(user.data.date)} </div>
                        </td>
                        <td>
                            <div class="scrollable">${user.data.name} </div>
                        </td>
                        <td>
                        <div class="scrollable">${user.data.email}</div>
                        </td>
                        <td><div class="scrollable">${user.data.mobileNo} </div></td>
                        <td> <div class="scrollable">${user.data.subject} </div></td>
                        <td><div class="scrollable">${user.data.message}</div></td>
                        </tr>`;
                }
            );
            html += '</table></body></html>';
            res.send(html);
        } catch (error) {
            functions.logger.info(error);
            res.status(500).send(error);
        }
    }
});




// app.get('/getenquiries', async (req,res) => {
//     try {
//         const userQuerySnapshot = await db.collection('enquiries').get();
//         functions.logger.info("userQuerySnapshot : ", userQuerySnapshot)
//         const users = [];
//         let html = `<!DOCTYPE html><html><head><title>Optilan Website Enquiries</title>
//                     <style>
//                         table {
//                             border-collapse: collapse;
//                             width: 100%;
//                         }
//                         th{
//                             background: green;
//                         }
//                         th, td {
//                             border: 1px solid #dddddd;
//                             text-align: left;
//                             padding: 8px;
//                         }
//                         .scrollable {
//                             max-height: 200px; /* Adjust this value as needed */
//                             overflow: auto;
//                         }
//                     </style>
//                </head><body>`;
//         html += '<h1 style="text-align:center">Optilan Website Enquiries</h1>';
//         html += `<table>
//                   <tr>
//                   <th>Date</th>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Mobile</th>
//                   <th>Subject</th>
//                   <th>Message</th>
//                   </tr>`;

//         userQuerySnapshot.forEach(
//             (doc)=>{
//                 let user = {
//                     id: doc.id,
//                     data:doc.data()
//               }
//                 users.push(user);

//                 html += `<tr>
//                         <td>
//                             <div class="scrollable">${formatDate(user.data.date)} </div>
//                         </td>
//                         <td>
//                             <div class="scrollable">${user.data.name} </div>
//                         </td>
//                         <td>
//                         <div class="scrollable">${user.data.email}</div>
//                         </td>
//                         <td><div class="scrollable">${user.data.mobileNo} </div></td>
//                         <td> <div class="scrollable">${user.data.subject} </div></td>
//                         <td><div class="scrollable">${user.data.message}</div></td>
//                         </tr>`;
//             }
//         );
//         html += '</table></body></html>';
//         res.send(html);
//     } catch (error) {
//         functions.logger.info(error);
//         res.status(500).send(error);
//     }
// });

function formatDate(date) {
    date = new Date(date);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    // Add leading zeros if necessary
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
};


app.post('/sendEnquiry', async (req, res) => {
    try {
        let data = req.body;
        data.date = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        let newDoc = await db.collection('enquiries').add(data);
        await mailController.newContactEnquiry(data).then((resp) => {
            newDoc.resolveData = resp.resolveData
            functions.logger.info("email sent : ", JSON.stringify(resp));
        }, (err) => {
            functions.logger.info("err : ", err)

        });
        res.status(201).json({ message: "Your message send successfully", data: newDoc });
    } catch (error) {
        functions.logger.info("errr : ", error)
        res.status(400).send(error);
    }
});

app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

// Export your Express app as a Firebase Function
exports.api = functions.https.onRequest(app);