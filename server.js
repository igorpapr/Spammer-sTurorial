let express = require('express');
const bodyParser = require("body-parser");
let server = express();
let db = require('./dbexec.js');
let nodemailer = require('nodemailer');

server.listen(8888);
console.log('Server is running on port 8888');

server.use(express.static(__dirname));
const urlencodedParser = bodyParser.urlencoded({extended: false});
const jsonParser = bodyParser.json();

server.get('/', function(req, res){
    res.sendFile(__dirname+"/index.html");
});

server.post('/send', urlencodedParser, async function(req, res){
    const subj = req.body.subject;
    const mess = req.body.message;
    let mails = [];
    await db.getAllUsers().then(x => {
        for (let user of x){
            mails.push(user._id);
        }
        send(subj, mess, mails);
        res.redirect('/');
    });
});

server.post('/add', jsonParser, async function(req, res){
    let newUser = req.body;
    await db.insertUser(newUser).then(
        result => {res.writeHead(200);},
        error => {res.writeHead(400)});
    res.end();
});

server.post('/del', jsonParser, async function(req, res){
    let data = req.body;
    await db.deleteUser(data.email).then(
        result => {res.writeHead(200);},
        error => {res.writeHead(400)});
    res.end();
});

server.post('/upd', jsonParser, async function(req, res){
    let data = req.body;
    await db.updateUser(data).then(
        result => {res.writeHead(200);},
        error => {res.writeHead(400)});
    res.end();
});

server.get('/getUsers', async function(req, res){
    await db.getAllUsers().then(x => {
        res.writeHead(200,{"Content-type": "text/plain; charset=utf-8"});
        res.write(JSON.stringify(x));
        res.end();
    });
});


async function send(subj, mess, maillist) {
    const mailfrom = '************';//emailAccount@maildomen.dom, //DISABLE SECURITY IN GOOGLE
                                                                  //IN ORDER TO GET THIS FUNCTION WORK
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: mailfrom,
            pass: "*******"//password here
        }
    });

    for (let mail of maillist){
        let result = await transporter.sendMail({
            from: mailfrom,
            to: mail,
            subject: subj,
            text: mess
        });
        console.log(result);
    }
}
