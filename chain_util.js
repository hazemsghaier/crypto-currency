const EC = require("elliptic").ec;
const sha256=require("crypto-js/sha256");
const { v1: uuidv1 } = require('uuid');
const ec = new EC("secp256k1");
class chain_util{
    static genartePaireOfKey(){
        return ec.genKeyPair();
    }
    static id(){
        return uuidv1();
    }
    static hash(data){
        return sha256(JSON.stringify(data)).toString();
    }
    static verifieSignature(publicKey,signature,dataHash){
        //on va decrypter la signature pour verifier qu elle est la meme que dataHash,verifier que la signiature est vrai
        return ec.keyFromPublic(publicKey,"hex").verify(dataHash,signature);
    }
}
module.exports=chain_util;