const {exec} = require("child_process")
const { resolve } = require("path")
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname , "outputs");

if(!fs.existsSync(outputPath))
{
    fs.mkdirSync(outputPath , {recursive : true});
}

const executeCpp = (filepath)=> {
    const jobId = path.basename(filepath).split(".")[0];
    const outpath = path.join(outputPath , `${jobId}.exe`)
    return new Promise((resolve , reject) =>{
        exec(`g++ "${filepath}" -o "${outpath}" && cd "${outputPath}" && .\\${jobId}.exe`, 
        (error , stdout , stderr) =>{
            error && reject({error , stderr});
            stderr && reject(stderr);
            resolve(stdout)
            // if(error){
            //     reject({error , stderr});
            // }
            // if(stderr)
            // {
            //     reject(stderr);
            // }
            // resolve(stdout);
        })

    })
}

module.exports = {
    executeCpp
}