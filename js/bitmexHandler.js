export class BitmexHandler {
    #keys;
    constructor(keys = "") {
        this.#keys = keys;
    }

    async #fetchPhp(searchParams) {
        searchParams.append("apiID", this.#keys.apiID);
        searchParams.append("apiSecret", this.#keys.apiSecret);
        searchParams.append("testnet", this.#keys.testnet);

        return fetch("./php/index.php", { method: 'post', body: searchParams })
           .then((response) => response.text())
           .then((text) => JSON.parse(text));
    }
    
    async get(path) {
        const searchParams = new URLSearchParams();
        searchParams.append("endpoint", path);
    
        return await this.#fetchPhp(searchParams);
    }

    async createOrder(path, type, side, price, quantity) {
        const searchParams = new URLSearchParams();
        searchParams.append("endpoint", path);
        searchParams.append("type", type);
        searchParams.append("side", side);
        searchParams.append("price", price);
        searchParams.append("quantity", quantity);
    
        return await this.#fetchPhp(searchParams);
    }
    
    async cancelOpenOrders(path, orderID) {
        const searchParams = new URLSearchParams();
        searchParams.append("endpoint", path);
        searchParams.append("orderID", orderID);
    
        return await this.#fetchPhp(searchParams);
    }
}
