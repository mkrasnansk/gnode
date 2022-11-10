const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const { response } = require("express");
require("dotenv").config();

const port = process.env.PORT || 80  ;

const corsOptions = {
   origin: ['*.owee-15664.firebaseapp.com','*.owee-15664.web.app','*.owee.sk','*.tiendapepe.sk'],
   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
 }

app.use(cors({
   origin: ['*.owee-15664.firebaseapp.com','*.owee-15664.web.app','*.owee.sk','*.tiendapepe.sk']
}));
app.use(express.urlencoded());
app.use(bodyParser.json());

app.use((req, res, next) => {
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader(
     "Access-Control-Allow-Methods",
     "POST"
   );
   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
   next();
 });

app.post("/mail", cors(corsOptions), function (req, res) {
   console.log(process.env.OAUTH_REFRESH_TOKEN);

   let data = req.body;
   if (!data.url) {
      res.status(500).send({ website: data.url, error: "Missing url" });
      return;
   } else {
      res.status(200).send({ website: data.url, websiteStatus: response.status });
      if (response.status !== 200) {
         sendMail(data, response.status);
      }
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

app.listen(port, () => {
   console.log(`nodemailerProject is listening at http://localhost:${port}`);
});
