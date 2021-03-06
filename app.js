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

    const url=process.env.URL;
    const options={
        method:"POST",
        auth:process.env.AUTH
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

