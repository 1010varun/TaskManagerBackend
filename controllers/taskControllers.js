const task = require('../models/model');

const getAllTasks = async (req, res) => {
    try{
        const dataArray = [];
        let response = await task.find();
        response = response.filter(user => user.username === req.user.name);
        for(let i = 0; i < response.length; i++){
            dataArray.push({"id":response[i].id, "taskdata": response[i].taskdata});
        }
        res.status(200).json(dataArray);
    } catch(err) {
        res.send({error : `${err.message}`}).status(401);
    }
}


const addTask = async (req, res) => {
    const user = req.user.name;
    const data = {
        username: user,
        taskdata: req.body.taskdata,
        id: req.body.id,
    }
    await task.create(data);
    res.status(200).send("post request successfull");
}


const updateTask = async (req, res) => {
    const{ id, taskdata} = req.body;
    if(id){
        const resp = await task.updateOne({
            id
        },
        {
            $set: {
                 taskdata
            }
        })
        if(resp.modifiedCount){
            res.status(200).json({"message" : "updated"});
        } else{
            res.status(404).json({"message": "unable to update"});
        }
    }
    else{
        res.status(404).json({"message" : "unable to update"});
    }
}


const deleteTask = async (req, res) => {
    console.log("in delete",req);
    const {id} = req.params;
    if(id){
        const resdata = await task.deleteOne({id});
        if (resdata.deletedCount === 1){ 
            res.status(200).json({"message" : "deleted successfully"});
        }
        else{
            res.status(404).json({"message": "unable to delete"});
        }
    }
    else{
        res.send(404).json({"message": "not a valid id"});
    }
}

module.exports = {
    getAllTasks,
    addTask,
    updateTask,
    deleteTask
}