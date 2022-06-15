import { LocalStorage } from "./localStorage.js";
import { BitmexHandler } from "./bitmexHandler.js";
import { popWalletHistory, popOpenOrders, popOrders, popPositions, popOrderBook, createTableRows } from "./popTable.js"

const localStorage = new LocalStorage();
let bitmex;
let openOrders;

const actions = {
    popWalletHistory : async()                    => popWalletHistory(mainTable, await bitmex.get("getWalletHistory")),
    popOpenOrders : async ()                      => openOrders = popOpenOrders(mainTable, await bitmex.get("getOpenOrders"), bitmex),
    popOrders :     async ()                      => popOrders(mainTable, await bitmex.get("getOrders")),
    popPositions :  async ()                      => popPositions(openPositions, await bitmex.get("getOpenPositions")),
    createOrder :   async (name) => {
        if(name && price && quantity){
            if(confirm(`Enviar ${ name } order de ${quantity.value} contratos no valor de: $ ${price.value} ? `)){
                await bitmex.createOrder("createOrder", "Limit", name, price.value, quantity.value);
                await actions.popOpenOrders();
                await actions.popPositions();
            }

        }
    },
    requestWithdrawal  : async() => {
        if(amount.value, walletAddress.value, fee.value, twoFactor.value){
            if(confirm(`Solicitar retirada de ${amount.value} Bitcoin \nPara a carteira: ${walletAddress.value} \nTaxa de saque de: ${fee.value} ? `)){
                if(await bitmex.requestWithdrawal("requestWithdrawal", twoFactor.value, amount.value, walletAddress.value, fee.value, note.value)){
                    alert("Confira seu e-mail");
                };
            }
        }
    },
    save             : () => actions.enableTrade(localStorage.add({ apiID: apiID.value, apiSecret: apiSecret.value, testnet: testnet.checked }), buttons),
    closeDivKeys     : () => formKeys.classList.remove("displayOn"),
    closeDivWithdraw : () => formWithdraw.classList.remove("displayOn"),
    openFormKeys     : () => formKeys.classList = "displayOn",
    openFormWithdraw : () => formWithdraw.classList = "displayOn",
    displayVolume    : () => volume.value = (quantity.value / price.value).toFixed(4),
    enableTrade      : (keys, buttons)  => {    
        if (keys == "" || keys.apiID == "" || keys.apiSecret == "") {
            keysDiv.innerHTML = "Adicionar Chaves";
            for (let button of buttons) {
                button.disabled = true;
            }
        }
    
        else {
            keysDiv.innerHTML = "Alterar Chaves";
            for (let button of buttons) {
                button.disabled = false;
            }
        }
        
        apiID.value = keys.apiID || "";
        apiSecret.value = keys.apiSecret || "";
        testnet.checked = keys.testnet || false;
    
        bitmex = new BitmexHandler(keys);
        actions.countDown();
    },
    countDown   : () => {
        setTimeout(async function () {
            const filled = popOrderBook(bookOffers, await bitmex.get("getOrderBook"), openOrders);
            if (filled){
                await actions.popOpenOrders();
                await actions.popPositions();
                new Audio('./assets/filled.mp3').play();
            }
            actions.countDown();
        }, 5000)
        divBook.scrollTo(0,300);
    }
}

const buttons   = document.querySelectorAll(`button`);
for (let button of buttons){
    button.addEventListener('click', handle) 
}

async function handle(e){
    e.preventDefault();

    const {value: action, name: param} = e.path[0];
    await actions[action](param);
}

createTableRows(bookOffers, 50);
actions.enableTrade(localStorage.load(), buttons);

keysDiv.addEventListener('click', actions.openFormKeys);
saveKeys.addEventListener('click', actions.save);
closeFormKeys.addEventListener('click', actions.closeDivKeys);
closeFormWithdraw.addEventListener('click', actions.closeDivWithdraw);
withdraw.addEventListener('click', actions.requestWithdrawal);

quantity.addEventListener('keydown', actions.displayVolume);
price.addEventListener('keydown', actions.displayVolume);