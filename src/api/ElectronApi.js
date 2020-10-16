import io from 'socket.io-client';

export class ElectronApi {

    constructor(host) {
        this.electronWS = null
        this.callBackFunctions = {}
        this.host = host;
        this.headers = {"Content-Type" : "application/json; charset=utf-8"};
        this.available=false
        //temporaire
        this.socket = {}
        this.checkAvailable();
    }

    handleError(e) {
        if (e.status == 401)
            throw Error("auth-failed");
        else
            throw Error("api-error" + e.status);
    }

    hostChanged(host){
        this.host = host;
        this.checkAvailable();
    }

    checkAvailable(){
        return fetch(`${this.host}/ok`, {
            method: "GET",
            headers: this.headers
        })
            .then(isOK => {
                this.available=true
                return true
            })
            .catch(() =>{
                this.available=false
                return false
            })
    }

    isAvailable(){
        return this.available;
    }

    setMikronoCredentials(mikronoUser,mikronoPassword){
        if(!this.isAvailable())return Promise.resolve(false);
        return fetch(`${this.host}/mc`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({username:mikronoUser, password:mikronoPassword})
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    print(body,printerName){
        if(!this.isAvailable())return Promise.resolve(false);
        return fetch(`${this.host}/print/${printerName}`, {
            method: "POST",
            headers: {"Content-Type": "text/html; charset=utf-8"},
            body: body
        })
            .catch(e => this.handleError(e))
    }

    printers(){
        if(!this.isAvailable())return Promise.resolve(false);
        return fetch(`${this.host}/printers`, {
            method: "GET",
            headers: this.headers
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    read(){
        if(!this.isAvailable())return Promise.resolve(false);
        return fetch(`${this.host}/read`, {
            method: "GET",
            headers: this.headers
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    createFirstUser(healthcareParty,user){
        if(!this.isAvailable())return Promise.resolve(false);
        return fetch(`${this.host}/create-first-user`, {
            method: "POST",
            headers: this.headers,
            body : JSON.stringify( [healthcareParty,user] )
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    replication(cloudKey,cluster){
        if(!this.isAvailable())return Promise.resolve(false);
        return fetch(`${this.host}/replicate`, {
            method: "POST",
            headers: this.headers,
            body : JSON.stringify( { cloudKey: cloudKey, cluster : cluster } )
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    checkDrugs(){
        if(!this.isAvailable())return Promise.resolve(false);
        return fetch(`${this.host}/checkDrugs`, {
            method: "GET",
            headers: this.headers
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    getPatient(patientId){
        if(!this.isAvailable())return Promise.resolve(false);
        return fetch(`${this.host}/getPatient`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                "patientId": patientId
            })
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    topazCredential(user,credentials){
        if(!this.isAvailable() || !user || !user.applicationTokens || !user.id || !credentials)return Promise.resolve(false);
        return fetch(`${this.host}/tc`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                "userId": user.id,
                "token": user && user.applicationTokens && Object.keys(user.applicationTokens).length ? user.applicationTokens.MIKRONO || user.applicationTokens.tmp || user.applicationTokens.tmpFirstLogin || user.applicationTokens[Object.keys(user.applicationTokens)[0]] : "",
                "credential": credentials
            })
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    tokenFHC(isMH,tokenId,token,keystoreIdMH,nihiiMH){
        if(!this.isAvailable())return Promise.resolve(false);
        return fetch(`${this.host}/tokenFHC`, {
            method: "POST",
            headers: this.headers,
            body: !isMH ?
                JSON.stringify({isMH:false,tokenId:tokenId, token:token}) :
                JSON.stringify({isMH:true,keystoreIdMH:keystoreIdMH, tokenIdMH:tokenId, tokenMH:token, nihiiMH:nihiiMH})
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    getVersion(){
        if(!this.isAvailable())return Promise.resolve(false);
        return fetch(`${this.host}/getVersion`, {
            method: "GET",
            headers: this.headers
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    getPrinterSetting(userId){
        if(!this.isAvailable())return Promise.resolve(false);
        return fetch(`${this.host}/getPrinterSetting`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                userId: userId
            })
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    setPrinterSetting(userId,printerSettingComplete){
        if(!this.isAvailable())return Promise.resolve(false);
        return fetch(`${this.host}/setPrinterSetting`, {
            method: "POST",
            headers: this.headers,
            body:JSON.stringify({
                userId : userId,
                settings: printerSettingComplete
            })
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    scanning(requestType,selectedScanner,scannerIndex,scannerColor,scannerDuplex){
        if(!this.isAvailable())return Promise.resolve(false);
        return fetch(`${this.host}/scanning`, {
            method: "POST",
            headers: this.headers,
            body:JSON.stringify({
                request: requestType,
                scanner: selectedScanner,
                index: scannerIndex,
                color: scannerColor,
                duplex: scannerDuplex
            })
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    getConnexionData(){
        if(!this.isAvailable())return Promise.resolve(false);
        return fetch(`${this.host}/getConnexionData`, {
            method: "GET",
            headers: this.headers
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    logout(){
        if(!this.isAvailable())return Promise.resolve(false);
        return fetch(`${this.host}/logout`, {
            method: "GET",
            headers: this.headers
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    openWebPage(url){
        if(!this.isAvailable())return Promise.resolve(false);
        return fetch(`${this.host}/openWebPage`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({url : url})
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    getConfigFile(){
        if(!this.isAvailable())return Promise.resolve(false);
        return fetch(`${this.host}/getConfigFile`, {
            method: "GET",
            headers: this.headers
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    setConfigFile(data){
        if(!this.isAvailable())return Promise.resolve(false);
        return fetch(`${this.host}/setConfigFile`, {
            method: "POST",
            headers: this.headers,
            body : JSON.stringify({
                data : data
            })
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    //websocket for read auto eid
    launchWS(callBackFunctions){
        Object.keys(callBackFunctions).map(key => {
            this.setCallBack(key,callBackFunctions[key])
        })

        this.getVersion().then(version => {

            if(version && version.version && version.version.split(".").length>=2 && !isNaN(parseInt(version.version.split(".")[1])) && parseInt(version.version.split(".")[1])>=4){
                const electronWS = new WebSocket(`${this.host.replace(/^http/, "ws")}/topazApi`)

                electronWS.addEventListener('open', function () {
                    console.log('electron connection established');
                });
                electronWS.addEventListener('error', (err) => {
                    console.log('error', err);

                });
                electronWS.addEventListener('message', (message) => {
                    electronWS.send(JSON.stringify(this.messageTreatment(message.data)))
                });
                electronWS.addEventListener('close', () => {
                    console.log('electron is closing');

                });

                this.electronWS = electronWS;
            }else{
                this.socket = io(this.host);

                this.socket.on("connect", () => {
                    console.log("connection avec le socket de electron")
                })

                this.socket.on("update-downloaded", msg => {
                    this.callBackFunctions["update-downloaded"](msg)
                })

                this.socket.on("auto-read-card-eid", cards =>{
                    this.callBackFunctions["auto-read-card-eid"](cards)
                })
            }
        })
    }

    setCallBack(method,newFunction){
        this.callBackFunctions[method]= newFunction;
    }

    messageTreatment(message){
        const messageObject = JSON.parse(message)
        return {
            id : messageObject.id,
            type : messageObject.type+"Response",
            message : messageObject.type ==="Queue" ? this.messageTreatment(messageObject.message) : this.callBackFunctions[messageObject.type](messageObject.message)
        }
    }

}
