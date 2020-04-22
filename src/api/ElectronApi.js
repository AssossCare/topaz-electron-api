
export class ElectronApi {

    constructor(host) {
        this.host = host;
        this.headers = {"Content-Type" : "application/json; charset=utf-8"};
        this.available=false
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
        if(!this.isAvailable())return false;
        return fetch(`${this.host}/mc`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({username:mikronoUser, password:mikronoPassword})
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    print(body,printerName){
        if(!this.isAvailable())return false;
        return fetch(`${this.host}/print/${printerName}`, {
            method: "POST",
            headers: this.headers,
            body: body
        })
            .catch(e => this.handleError(e))
    }

    printers(){
        if(!this.isAvailable())return false;
        return fetch(`${this.host}/printers`, {
            method: "GET",
            headers: this.headers
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    read(){
        if(!this.isAvailable())return false;
        return fetch(`${this.host}/read`, {
            method: "GET",
            headers: this.headers
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    createFirstUser(healthcareParty,user){
        if(!this.isAvailable())return false;
        return fetch(`${this.host}/create-first-user`, {
            method: "POST",
            headers: this.headers,
            body : JSON.stringify( [healthcareParty,user] )
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    replication(cloudKey){
        if(!this.isAvailable())return false;
        return fetch(`${this.host}/replicate`, {
            method: "POST",
            headers: this.headers,
            body : JSON.stringify( { cloudKey: cloudKey } )
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    checkDrugs(){
        if(!this.isAvailable())return false;
        return fetch(`${this.host}/checkDrugs`, {
            method: "GET",
            headers: this.headers
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    getPatient(patientId){
        if(!this.isAvailable())return false;
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
        if(!this.isAvailable() || !user || !user.applicationTokens || !user.id || !credentials)return false;
        return fetch(`${this.host}/tc`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                "userId": user.id,
                "token": user.applicationTokens.MIKRONO || user.applicationTokens.tmp || user.applicationTokens.tmpFirstLogin || user.applicationTokens.find(txt=> txt),
                "credential": credentials
            })
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    tokenFHC(isMH,tokenId,token,keystoreIdMH,nihiiMH){
        if(!this.isAvailable())return false;
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
        if(!this.isAvailable())return false;
        return fetch(`${this.host}/getVersion`, {
            method: "GET",
            headers: this.headers
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    getPrinterSetting(userId){
        if(!this.isAvailable())return false;
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
        if(!this.isAvailable())return false;
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
        if(!this.isAvailable())return false;
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
        if(!this.isAvailable())return false;
        return fetch(`${this.host}/getConnexionData`, {
            method: "GET",
            headers: this.headers
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    logout(){
        if(!this.isAvailable())return false;
        return fetch(`${this.host}/logout`, {
            method: "GET",
            headers: this.headers
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    openWebPage(url){
        if(!this.isAvailable())return false;
        return fetch(`${this.host}/openWebPage`, {
            method: "POST",
            headers: this.headers,
            body: {url : url}
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    getConfigFile(){
        if(!this.isAvailable())return false;
        return fetch(`${this.host}/getConfigFile`, {
            method: "GET",
            headers: this.headers
        })
            .then(response => response.json())
            .catch(e => this.handleError(e))
    }

    setConfigFile(data){
        if(!this.isAvailable())return false;
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

}
