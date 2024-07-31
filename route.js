//fileName: route.js
const express = require ("express");
const router = express.Router();

const upload = require("./fileUpload");
router.post("/upload/",  upload.single("userProfile"),(req,res)=>{
   
    if(!req.file){
        return res.redirect("/")
    }
    else{   
        
        let filePath = `images/${req.file.filename}`;
        res.render("image", {
        filePath
       }) 
    }
})