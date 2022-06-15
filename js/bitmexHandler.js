export class BitmexHandler {
    #keys;
    constructor(keys = "") {
        this.#keys = keys;
    }

    async #fetchPhp(searchParams) {
        searchParams.append("apiID", this.#keys.apiID);
        searchParams.append("apiSecret", this.#keys.apiSecret);
        searchParams.append("testnet", this.#keys.testnet);

        const response = await fetch("./php/index.php", { method: 'post', body: searchParams })
            .then((response) => response.text());

        if (response) {
            try {
                return JSON.parse(response);

            } catch (e) {
                alert(response);
            }
        }
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

    async requestWithdrawal(path, twoFactor, amount, walletAddress, fee, note) {
        const searchParams = new URLSearchParams();
        searchParams.append("endpoint", path);
        searchParams.append("twoFactor", twoFactor);
        searchParams.append("amount", amount);
        searchParams.append("walletAddress", walletAddress);
        searchParams.append("fee", fee);
        searchParams.append("note", note);

        return await this.#fetchPhp(searchParams);
    }
}
