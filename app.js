//jshint esversion:6

const express = require("express")
const https = require("https")
const bodyParser = require("body-parser")


const app = express()
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))

const port = 3000

app.get("/", (req, res)=> {
    res.sendFile(`${__dirname}/signup.html`)
})


app.post("/", (req, res)=> {

    //data from post request
    var firstName = req.body.firstName
    var lastName = req.body.lastName
    var email = req.body.email

    //construct data to send
    const data = {
        members: [
            {
                email_address: email, 
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    //turn data into json
    const json_data = JSON.stringify(data)  //data ready


    //now, create a request object  to POST the data to mailchimp
    const url = "https://us7.api.mailchimp.com/3.0/lists/b37b2ceff7"

    const options = {
        method: "POST",
        auth: "pmessan:1659e1d0b53e865cbf178d360ffd992c-us7"
    }

    const request = https.request(url, options, (response)=> {
        if (response.statusCode === 200) {
            res.sendFile(`${__dirname}/success.html`)
        } else {
            res.sendFile(`${__dirname}/failure.html`)
        }
        response.on("data", (data)=>{
            console.log(JSON.parse(data))
        })
    })

    

    request.write(json_data)
    request.end()
    // console.log(JSON.parse(res))
})

app.post("/failure", (req, res)=> {
    res.redirect("/")
})




app.listen(process.env.PORT || port, ()=> {
    console.log(`Server running on port ${port}`)
})



// List ID 
// b37b2ceff7



// Mailchimp API Key 
// 1659e1d0b53e865cbf178d360ffd992c-us7
