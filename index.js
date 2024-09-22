import express from 'express';
import fs from 'fs/promises';

const app=express();

app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));

app.get("/",async function(req,res){
    const files=await fs.readdir("./files");
    console.log(files);
    res.render("index",{files})
})

app.post("/upload",async function(req,res){
    const {title,content}=req.body;
    await fs.writeFile("./files/"+title+".txt",content)
    res.redirect("/");
})

app.get("/content/:file",async function(req,res){
    const file=req.params.file;
    const content=await fs.readFile("./files/"+file+".txt");
    res.render("content",{content})
})

async function checkFileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return false;
      } else {
        throw error; 
      }
    }
  }

app.listen(3000,async ()=>{
    if(!(await checkFileExists("./files"))){
        fs.mkdir("./files");
    }
    console.log("http://localhost:3000");
})