const express=require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https=require("https");

const app=express();
app.use(express.static("public"));                                  //always used when local and remote locations are present (static files)
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html");
})
app.post("/",function(req, res)
{
    const firstName=req.body.fname;
    const secondName=req.body.sname;
    const email=req.body.mail;
    
    var data={
        members:[{
            email_address:email,
            status:"subscribed",
            merge_fields:{
                FNAME:firstName,
                LNAME:secondName
            }
        }]
    };
    const jsonData= JSON.stringify(data);

    const url="https://us7.api.mailchimp.com/3.0/lists/29f57eff00";
    const options={
        method:"POST",
        auth:"saket1:f76aa6ae362b4b0e6770ecd6c9adc9ce-us7"
    }

    const request=https.request(url,options,function(response){

        if(response.statusCode==200){
            res.sendFile(__dirname +"/success.html");
        }
        else{
            res.sendFile(__dirname +"/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();


});

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){         //heroku selects its port 
    console.log("Running on port 3000");
});

//api key
//f76aa6ae362b4b0e6770ecd6c9adc9ce-us7

//list id
//29f57eff00