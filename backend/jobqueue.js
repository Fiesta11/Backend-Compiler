const queue = require("bull");
const {executeCpp} = require('./executecpp')
const { executePy } = require("./executepy")


const job_queue = new queue("job_queue");
const num_workers = 5;
const Job = require('./models/job')


job_queue.process(num_workers , async({data}) =>{
    console.log(data);
    const{id : jobId} = data;
    const job = await Job.findById(jobId);

    if(job === undefined)
    {
        throw error("Job not found")
    }
    console.log("fetched Job" , job);
    try{
        job["startedAt"] = new Date();
        if(job.language === "cpp")
        {
           output = await executeCpp(job.filepath);
        }
        else{
          output = await executePy(job.filepath);
        }
  
        job["completedAt"] = new Date();
        job["status"] = "success";
        job["output"] = output;
  
        await job.save();
        console.log(job);
        
    }
    catch(error){
     job["completedAt"] = new Date();
      job["status"] = "error";
      job["output"] = JSON.stringify(error);
      await job.save();
      console.log(job);
      // res.status(500).json({ error: error });
    }
    return true;
})

job_queue.on("failed" , (error) =>{
    console.log(error.data.id , "failed" , error.failedReason);
})

const add_job_to_queue = async(jobId) => {
    await job_queue.add({id : jobId});
}

module.exports = {
    add_job_to_queue
}