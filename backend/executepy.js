const {exec} = require("child_process")
const { resolve } = require("path")


const executePy = (filepath)=> {
    return new Promise((resolve , reject) =>{
        exec(`python "${filepath}"`, 
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
    executePy,
}