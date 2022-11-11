const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const { response } = require("express");
require("dotenv").config();

app.use(express.urlencoded());
app.use(bodyParser.json());

const corsOptions = {
   origin: "*",
   // origin: ["https://www.owee.sk", "www.owee.sk", "owee.sk", "https://owee.sk", "https://owee-15664.firebaseapp.com", "https://owee-15664.web.app", "https://www.tiendapepe.sk"],
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

app.post("/mail", cors(corsOptions), function (req, res) {
   let data = req.body;
   if (!data.url) {
      res.status(500).send({ website: data.url, error: "Missing url" });
      return res;
   } else {
      res.status(200).send({ website: data.url, websiteStatus: response.status });
      if (response.status !== 200) {
         sendMail(data, response.status);
      }
      return res;
   }
});

const sendMail = (data, status) => {
   let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
         type: "OAuth2",
         user: process.env.MAIL_USERNAME,
         pass: process.env.MAIL_PASSWORD,
         clientId: process.env.OAUTH_CLIENTID,
         clientSecret: process.env.OAUTH_CLIENT_SECRET,
         refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      },
   });

   let mailOptions = {
      from: data.name,
      to: "miso.krasnansky@gmail.com",
      subject: "Nodemailer Project",
      text: "Hi from your nodemailer project" + data.url,
   };

   transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
         console.log("Error " + err);
      } else {
         console.log("Email sent successfully");
      }
   });
};
const port = process.env.PORT || 80;

app.listen(port, () => {
   console.log(`nodemailerProject is listening at http://localhost:${port}`);
});
