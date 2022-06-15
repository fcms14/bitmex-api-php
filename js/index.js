import { LocalStorage } from "./localStorage.js";
import { BitmexHandler } from "./bitmexHandler.js";
import { popWalletHistory, popOpenOrders, popOrders, popPositions, popOrderBook, createTableRows } from "./popTable.js"

const localStorage = new LocalStorage();
let bitmex;

const actions = {
    popWalletHistory : async()                    => popWalletHistory(mainTable, await bitmex.get("getWalletHistory")),
    popOpenOrders : async ()                      => popOpenOrders(mainTable, await bitmex.get("getOpenOrders"), bitmex),
    popOrders :     async ()                      => popOrders(mainTable, await bitmex.get("getOrders")),
    popPositions :  async ()                      => popPositions(openPositions, await bitmex.get("getOpenPositions")),
    createOrder :   async (name) => {
        if(name && price && quantity){
            if(confirm(`Enviar ${ name } order de ${quantity.value} contratos no valor de: $ ${price.value} ? `)){
                await bitmex.createOrder("createOrder", "Limit", name, price.value, quantity.value);
                await actions['popOpenOrders']();
                await actions['popPositions']();
            }

        }
    },
    save          : () => actions.enableTrade(localStorage.add({ apiID: apiID.value, apiSecret: apiSecret.value, testnet: testnet.checked }), buttons),
    close         : () => formKeys.classList.remove("displayOn"),
    open          : () => formKeys.classList = "displayOn",
    displayVolume : () => volume.value = (quantity.value / price.value).toFixed(4),
    enableTrade   : (keys, buttons)  => {    
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
            popOrderBook(bookOffers, await bitmex.get("getOrderBook"));
            actions.countDown();
        }, 5000)
        divBook.scrollTo(0,300);
    }
}

const buttons   = document.querySelectorAll(`button`);
for (let button of buttons){
    button.addEventListener('click', await handle) 
}

async function handle(e){
    e.preventDefault();

    const {value: action, name: param} = e.path[0];
    await actions[action](param);
}

createTableRows(bookOffers, 50);
actions.enableTrade(localStorage.load(), buttons);

saveKeys.addEventListener('click', actions.save);
closeDiv.addEventListener('click', actions.close);
keysDiv.addEventListener('click', actions.open);

quantity.addEventListener('keydown', actions.displayVolume);
price.addEventListener('keydown', actions.displayVolume);