const Transaction_poll=require("./transaction_poll");
const Transaction=require("./transaction");
const Wallet =require("./index");
describe("transaction pool",()=>{
    let tp,transaction,wallet;
    beforeEach(()=>{
        wallet=new Wallet();
        tp=new Transaction_poll();
        transaction=Transaction.newTransaction(wallet,"hhhhhhhhhhhhh",50);
        tp.updateOrAddTransaction(transaction);
    })
    it("it add transaction correctly",()=>{
        expect(tp.transactions.find((t)=>{
            return t.id === transaction.id
        })).toEqual(transaction);
    })
    it("it update transaction in the pool",()=>{
        const oldTransaction=JSON.stringify(transaction);
        transaction.update(wallet,"mananana",20);
        let newtransaction = transaction;
        tp.updateOrAddTransaction(newtransaction);
        expect(JSON.stringify(tp.transactions.find((t)=>{
            return t.id === newtransaction.id
        }))).not.toEqual(oldTransaction);
    })
    describe("mixing valid transaction and corrupt",()=>{
        let validTransaction=[];
        beforeEach(()=>{
             let tp1 = new Transaction_poll()
             let wallet1=new Wallet()
            for(let i=0;i<6;i++){
                transaction = wallet1.createTransaction("55555555",30,tp1);
                if(i %2==0){
                    transaction.input.amount=99999;

                }else{
                    validTransaction.push(transaction);
                }
              
            }
        })
        it("verifier qu il ya des invalid transaction",()=>{
            expect(validTransaction).not.toEqual(tp.transactions);
        })
        it("verifier que la fonction validTransactions retourne seullement les valid transaction",()=>{
            expect(validTransaction).not.toEqual(tp.validTransactions());
        })
        
        

    })
})