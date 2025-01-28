const express=require("express")
const path=require("path")
const fs=require("fs")
const cors=require("cors")
const app=express()
const env=require("dotenv")
env.config();
const port=process.env.port||7000;
const filepath=path.join(__dirname,"song.mp4")
app.use(cors())
app.get("/",(req,res)=>{
    res.send("<h1>hello world</h1>")
})
app.get("/video",(req,res)=>{
    const sata=fs.statSync(filepath)
    const filesize=sata.size
    // console.log(filesize)
    const range=req.headers.range
    console.log("range=",range)
    if(range){
        const part=range.replace(/bytes=/,"").split("-")
        console.log("part=",part)
        const start=parseInt(part[0],10)
        const end=part[1]?parseInt(part[1],10):filesize-1
        console.log(`start=${start} and end = ${end}`)
        const chunksize=end-start+1
        console.log("chunksize=",chunksize)
        const file=fs.createReadStream(filepath,{start,end})
        res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${filesize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/mp4",
          });
          file.pipe(res)
        
    }else{
        res.writeHead(206,{
            "Content-Length": filesize,
            "Content-Type": "video/mp4",

        })
        fs.createReadStream(filepath).pipe(res)
    }
    
})
app.listen(port,()=>{
    console.log(`server is working on ${port}......`)
})