const {MongoClient}= require('mongodb')

let connectionString = 'mongodb://127.0.0.1:27017/'

const client = new MongoClient(connectionString)

async function connectingToDb(dataBase){
    try{await client.connect();
        let dB = client.db(dataBase);
        return dB;
    }catch(error){
        console.error('Error in connecting a dataBase')
        throw error;
    }
}
    

function dB1(){
    return connectingToDb('userDataBase') //userDataBase is the name of the prefered database
}
function dB2(){
    connectingToDb('anyDataBase')     //anyDatabase is the name of the prefered database
}


module.exports = {dB1,dB2}