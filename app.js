const express = require ("express")
const bodyParser = require ("body-parser")
const request = require ("request")
const https = require("https")
// import Contact "./signUpComponents/components/pages/contact.js"

const app = express ()
// static folder
app.use(express.static("public"))

// bodyparser Middleware
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function(req, res) {
res.sendFile(__dirname + "/signup.html")

});

//signup route
app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const email = req.body.email;

//JSON data being sent to Mailchimp
  let data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
        }
      }
    ]
  }

  //turn to flatpack into a string -> this will be sent to mailchimp
  const jsonData = JSON.stringify(data)

  const url = "https://us19.api.mailchimp.com/3.0/lists/fdc6f83c94"

  const options = {
    method: "POST",
    //provide authentication SomeValue:ApiKey:
    auth: "fahad1:6cc72271a4b57d86ec5937840c0c22fa-us19" 
  }

  const request = https.request(url,options, function(response){

    //check the status of the code 
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")
      }  else {
         res.send(__dirname + "/fail.html")
       }
  

    response.on("data", function(data){
      console.log(JSON.parse(data))
    })
  })
  request.write(jsonData)
  request.end()

});

// //this is the failure route that redirects to home
// route-> app.get
app.post("/failure", function(req, res) {
  res.redirect("/")
})

//listening to local port on 3000
// process.env.port will allow heroku to create their own server
app.listen(process.env.PORT || 3000, function () {
  console.log("server is running on port 3000")
});

