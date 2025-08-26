const {default: mongoose} = require('mongoose');

const dbconnect = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        if(conn.connection.readyState === 1){
            console.log("DB connected successfully");}
        else console.log("DB connect failed");
    }catch(err){
        console.log("Error in DB connection");
        throw new Error(err);
    }
}
module.exports = dbconnect;