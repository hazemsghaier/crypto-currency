const Transaction = require("./transaction");

class Transaction_poll{
    constructor(){
        this.transactions=[];
    }
    //on va ajouter une transaction au pool si elle n existe pas ou en vas le update
    updateOrAddTransaction(transaction){
        let transactionId=this.transactions.find((t)=>{
            return t.id===transaction.id;
        })
        if(transactionId){
            this.transactions[this.transactions.indexOf(transactionId)]=transaction;
        }else{
            this.transactions.push(transaction);
        }
    }
    exist(publicKey){
        return this.transactions.find((t)=>{
            return t.input.adress===publicKey;
        })
    }
    //on va verifier que ballance du wllaet est valide ,la signature
    validTransactions(){
        return this.transactions.filter( (t)=>{
            const outputTotale = t.output.reduce((total,output)=>{
                return total+output.amount
            },0)
            if(t.input.amount !==outputTotale){
                console.log(`la transaction de l id ${t.id} est invalide`)
                return;
            }
            if(!Transaction.verifyTransaction(t)){
                console.log(`la transaction de l id ${t.id} est invalide`);
                return;

            }
            return t;
        })
    }
    clear(){
        this.transactions=[];
    }
}
module.exports=Transaction_poll;