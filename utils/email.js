require('dotenv').config()

const mailgun = require("mailgun-js");
const DOMAIN = "add your domain";
const mg = mailgun({apiKey: "add your key here", domain: DOMAIN});
const data = {
	from: "test",
	to: "test",
	subject: "Hello",
	html: "<h1>test!</h1>"
};
mg.messages().send(data, function (error, body) {
	console.log(body);
});
