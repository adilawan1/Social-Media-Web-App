const express=require("express")
const bodyParser=require("body-parser")
const mongoose=require("mongoose")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const User=require("./models/user.js")

const app=express();


//REGISTER
app.post("/register",async(req,res)=>{
const user=req.body;

const takenUsername=await User.findOne({username: user.username})

const takenEmail=await User.findOne({email: user.email})

if(takenEmail || takenUsername)
{
res.json({message:"Username or email has already been taken"})

}else{

user.password= await bcrypt.hash(req.body.password,10)

const dbUser=new User({
username:user.username.toLowerCase(),
email:user.email.toLowerCase(),
password:user.password



})
dbUser.save()
res.json({message:"Success"})

}


})

//LOGIN
app.post("/login",(req,res)=>{

const userLoggingIn=req.body;
User.findOne({username:userLoggingIn.username})
.then(dbUser=>{
if(!dbUser){
return res.json({message:"Invalid Username or Password"})

}

bcrypt.compare(userLoggingIn.password,dbUser.password)
.then(isCorrect=>{
    if(isCorrect){
        const payload={
id: dbUser._id,
username: dbUser.username,
        }
        jwt.sign(
payload,process.env.JWT_SECRET,{expiresIn:86400},
(err,token)=>{
if(err) return res.json({message:err})
return res.json({
message:"Success",
token:"Bearer" + token
    
})

}
)
    }

else {

    return res.json({
        message:"Invalid Username or Password"
    })
}

} )

})

})
//MIDDLEWARE

function verifyJWT(req,res,next) {

    const token=req.headers["x-access-token"]?.split(' ')[1]

    if(token){
jwt.verify(token,process.env.PASSPORTSECRET,(err,decoded)=>
{
if (err) {
    return res.json({
isloggedIn:false,
message:"Failed To Authenticate"
    })
}
req.user={};
req.user.id=decoded.id
req.user.username=decoded.username 
next()
}
)


    }
else{

    res.json({message:"Incorrect Token Given", isloggedIn: false})
}    
}

app.get("/getUsername",verifyJWT,(req,res)=>{

    res.json({isloggedIn:true,username:req.user.username})
})



const urlencodedParser= bodyParser.urlencoded({extended:false})
app.use(bodyParser.json(),urlencodedParser);

const dbURL="mongodb+srv://Adil:asdfghjkl@cluster0.pau0k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect(dbURL,{useNewUrlParser:true,useUnifiedTopology:true})
.then((res)=>{

    app.listen(5000,()=>console.log("Server is live"))
})
.catch(err=>console.log(err))




