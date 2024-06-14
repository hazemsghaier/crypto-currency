const SHA256 = require("crypto-js/sha256")
const {difficulty,mine_rate }=require("../config")
class Block {
    constructor(timeStamp,lastHash,hash,data,nonce,difficulty1){
        this.timeStamp=timeStamp;
        this.lastHash=lastHash;
        this.hash=hash;
        this.data=data;
        this.nonce=nonce;
        this.difficulty1=this.difficulty1 || difficulty;
    }
    toString(){
        return `Block--
        timestamp : ${this.timeStamp};
        lasthash : ${this.lastHash.substring(0,20)}
        hash : ${this.hash.substring(0,20)}
        data : ${this.data}
        difficulty : ${this.difficulty1}
        nonce :${this.nonce}`;


    }
   static genisis(){
         return new this("genisis","00000000000000","lfjhvlghvgcuhjhjuhjkvhj55",[],0,difficulty);

    }
    static mineBlock(lastBlock,data){
        let hash,timeStamp;
        const lastHash= lastBlock.hash;
        let {difficulty1} = lastBlock;
        let nonce=0;
        do {
            nonce++;
            timeStamp= Date.now();
            difficulty1=this.adjustDifficuty(lastBlock,timeStamp);

             hash =Block.hash(timeStamp,lastHash,data,nonce,difficulty1);
        } while (hash.substring(0,difficulty1 )!== "0".repeat(difficulty1));
         return new this(timeStamp,lastHash,hash,data,nonce,difficulty1);

    }
    static hash(timeStamp,lastHash,data,nonce,difficulty1){
        return SHA256(`${timeStamp},${lastHash},${data},${nonce},${difficulty1}`).toString()
    }
    static blockHash(block){
        const {timeStamp,lastHash,data,nonce,difficulty1} = block;
        console.log({timeStamp,lastHash,data,nonce,difficulty1})

        return Block.hash(timeStamp,lastHash,data,nonce,difficulty1);
    }
    static adjustDifficuty(lastBlock,currentTimeStamp){
        let {difficulty1} =lastBlock;
        difficulty1=lastBlock.timeStamp + mine_rate > currentTimeStamp ? difficulty1+1 : difficulty1-1;
        return difficulty1+1;
    }
}
module.exports=Block;