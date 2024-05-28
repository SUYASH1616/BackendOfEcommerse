const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json({ limit: "10mb" }))

const PORT = process.env.PORT || 8080

//mongodb connection
console.log(process.env.MONGODB_URL)
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("connect to database"))
    .catch((err) => console.log(err))

//schema
const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    confirmPassword: String,
    image: String
})

//model
const userModel = mongoose.model("user",userSchema)

//api

app.get("/", (req, res) => {
    res.send("server is running")
})

//signup api
app.post("/Signup", async (req, res) => {
    // console.log(req.body);
    const { email } = req.body;
    
    try {
        const result = await userModel.findOne({ email: email });

        if (result) {
            return res.send({ message: "Email id is already registered" , alert : false });
        }

        const data = userModel(req.body);
        await data.save();

        res.send({ message: "Successfully signed up" , alert : true});
    } catch (err) {
        console.error(err);
        // Handle other errors or send an appropriate response
        res.status(500).send({ message: "Internal server error" });
    }
});

//login api
app.post("/Login", async (req, res) => {
    try {
        console.log(req.body);
        const { email } = req.body;
        
        // Assuming userModel is your Mongoose model
        const result = await userModel.findOne({ email: email });
        
        if (result) {
            const dataSend = {
                id: result.id,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                image: result.image, // corrected typo from "emage" to "image"
            };
            
            console.log(dataSend);
            res.send({ message: "Login is successful", alert: true, data: dataSend });
        } else {
            // If user is not found
            res.send({ message: "email id not found", alert: false });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});


// Product section

//schema
const schemaProduct = mongoose.Schema({
    name:String,
    category:String,
    image:String,
    price:String,
    description:String
});

//model
const productModel = mongoose.model("product",schemaProduct)

// Save product in database
// api
app.post("/uploadProduct" , async(req,res) =>{
    console.log(req.body)

    const data = await productModel(req.body)
    const datasave = await data.save()

    res.send({message : "Upload successfully"})
})

//
app.get("/product" ,async(req,res) =>{
    const data = await productModel.find({})
    res.send(JSON.stringify(data))
})

//server is running
app.listen(PORT, () => console.log("server is running at port : " + PORT)) 
