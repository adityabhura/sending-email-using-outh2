var express=require("./node_modules/express");
var nodemailer=require("./node_modules/nodemailer/lib/nodemailer");
var app=express();
var bodyPareser=require("body-parser");
var {google}=require("googleapis");
var oauth2=google.auth.OAuth2;

if(app.get('env')=='development'){
var dotenv=require("dotenv").config();
}



var clientId=process.env.CLIENTID;
var clientSecret=process.env.CLIENTSECRET;


var oauth2Client=new oauth2(
    clientId,clientSecret,"https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token:process.env.REFRESHTOKEN
});

var accessToken=oauth2Client.getAccessToken();

app.use(bodyPareser.urlencoded({extended:true}))

console.log(accessToken);


var auth = {
    type: 'oauth2',
    user: 'testingemailbyaditya@gmail.com',
    clientId: clientId,
    clientSecret: clientSecret,
    refreshToken: process.env.REFRESHTOKEN,
    accessToken:accessToken
};



app.use(express.json());
app.use(express.urlencoded());
// app.use(express.multipart());

app.set("view engine","ejs");

app.get('/',function(req,res){
    res.render("home.ejs");
})


app.post('/send', function(req, res){
    response = {
      name:'Aditya Bhura',
      email: 'testingemailbyaditya@fmail.com',
      message:'May You leave long'
    }
    
    
    var mailOptions = {
        from: 'aditya',
        to: req.body.email,
        subject: req.body.subject,
        text: req.body.message,
        html: '<p>'+req.body.text+'</p>',
    };
  var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: auth,
    });
  transporter.sendMail(mailOptions, function(err, info){
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log(JSON.stringify(info));
            res.send("success");
        }
    });
  })


app.listen(process.env.PORT,function(){
    console.log("Server Started");
})