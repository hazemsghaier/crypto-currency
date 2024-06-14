const wallet =require("./index");
const Transaction_poll=require("./transaction_poll");
describe("walet",()=>{
    let tp,walet;
    beforeEach(()=>{
        walet=new wallet();
        tp=new Transaction_poll();
    })
    describe("create a transaction",()=>{
        let transaction ,recipient,amount;
        beforeEach(()=>{
            amount=50;
            recipient="ebenbivuienjv hpinjv";
            transaction=walet.createTransaction(recipient,amount,tp);
        })
        describe("and doing the same transaction",()=>{
            beforeEach(()=>{
                walet.createTransaction(recipient,amount,tp);
            })
            it("double amount will be substucted from the wallet balance",()=>{
                expect(transaction.output.find((o)=>{
                    return o.adress === walet.publicKey
                }).amount).toEqual(walet.balance-2*amount)
            })
            it("",()=>{
                expect(transaction.output.filter((o)=>{
                    return o.adress===recipient;
                }).map(o => o.amount)).toEqual([amount,amount])
            })
        })
    })
})