export class LocalStorage{
    constructor(){
        this.address = "@keys";
        this.keys = JSON.parse(localStorage.getItem(this.address)) || [];
    }

    load() {
        return this.keys;
    }

    add(value) {
        this.keys = value;
        localStorage.setItem(this.address, JSON.stringify(this.keys));
        return this.keys;
    }
}