const websocket= require("ws");
const args = process.argv;
const p2p_port= args[2] ? parseInt(args[2]):5001;;
const peers =args[4] ? args[4].split(","):[];
const MESSAGE_TYPES ={
    chain :"chain",
    transaction:"transaction",
    clearTransaction : "clearTransaction"
}
class p2p_server{
    constructor(blockchain,transactionpoll){
        this.blockchain=blockchain;
        this.transactionpoll=transactionpoll;
        //connected web sockets connected to this one
        this.sockets=[];
    }
    listen(){
        //making the websocket server
        const server = new websocket.Server({port:p2p_port});
        //make the arrow function inside ON when a new websocket conection will connect to us
        server.on("connection",(socket)=>{
            this.connectSocket(socket);
           
            socket.on("close",()=>{
                this.sockets=this.sockets.filter((item)=>{
                    return item !== socket
                })
            });
        });
       
        this.connectToPeers();
        console.log( `we are listning on port ${p2p_port}`)

    }
    connectSocket(socket){
        this.sockets.push(socket);
        console.log(`socket connected `);
        this.messageHandeler(socket);
        this.sendChain(socket);

    }
     connectToPeers(){
        for(let i=0;i<peers.length;i++){
            const socket=new websocket(peers[i]);
            socket.on("open",()=>{this.connectSocket(socket);
                
            });    
        }
    }
    sendChain(socket){
        socket.send(JSON.stringify({type:MESSAGE_TYPES.chain,chain :this.blockchain.chain}));

    }
    sendTransaction(socket,transaction){
        socket.send(JSON.stringify({type : MESSAGE_TYPES.transaction,transaction}))
    }
    messageHandeler(socket){
        socket.on("message",(Data)=>{
            const message = JSON.parse(Data);
            switch(message.type){
                case MESSAGE_TYPES.chain:
                    this.blockchain.replaceChain(message.chain) ;
                    break;
                case MESSAGE_TYPES.transaction:
                    this.transactionpoll. updateOrAddTransaction(message.transaction) ;   
                break;
                case MESSAGE_TYPES.clearTransaction:
                    this.transactionpoll.clear();
            }
           })
    }
    syncChain(){
        this.sockets.forEach((socket)=>{
            this.sendChain(socket);

        })
    }
    //elle va informer tous les voisin du nouvelle update sur les transaction
    broadCastTransaction(transaction){
        this.sockets.forEach((socket)=>{
            this.sendTransaction(socket,transaction);
        })
    }
    broadCastTransactionClear(){
        this.sockets.forEach((socket)=>{
            socket.send(JSON.stringify({type : MESSAGE_TYPES.clearTransaction}))

        })
    }
}
module.exports=p2p_server;