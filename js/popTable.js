function cleanTable(tableElement){	
	tableElement.innerHTML 		= 	"";	
}

function qtyFormat(value, currency){
	return currency == "USDt" ? value / 1000000 : value;
}

function totalFormat(value, price, currency){
	return currency == "USDt" ? (value * price) : value;
}

function createCells(row, price, size, total){
	const cellPrice 		= 	row.cells[0];
	const cellsize		    =	row.cells[1];
	const cellTotal			=	row.cells[2];
	
	if (row.cells[0].textContent != price){
		row.cells[0].classList.toggle('change');
		row.cells[0].classList.toggle('row');
	}
	if (row.cells[1].textContent != size){
		row.cells[1].classList.toggle('change');
		row.cells[1].classList.toggle('row');
	}
	if (row.cells[2].textContent != total){
		row.cells[2].classList.toggle('change');
		row.cells[2].classList.toggle('row');
	}

	cellPrice.innerHTML		=	price;
	cellsize.innerHTML	    =	size;
	cellTotal.innerHTML		=	total;
}

function createHeaders(row, columnTitle){
	for(let i = 0; i < columnTitle.length; i++){
		row.insertCell(i).outerHTML = `<th>${columnTitle[i]}</th>`;
	}
}

export function popOrderBook(tableElement, data){

	if(data.length > 0) {		
		const table					=	tableElement;
		let total 					=	0;
		const buyOffers 			= data.filter((n) => n.side ==='Buy');
		const sellOffers 			= data.filter((n) => n.side ==='Sell');
		
		for (let i = sellOffers.length - 1; i >= 0; i--) {
			total += sellOffers[i].size
			table.rows[i].classList.add("sellBook");
			createCells(table.rows[i], sellOffers[i].price.toFixed(1), sellOffers[i].size, total);		
		}	

		total 						=	0;
		let row 					=	sellOffers.length;
		table.rows[row++].cells[1].innerHTML = " --- ";
		
		for (let i = 0; i < buyOffers.length; i++) {
			total +=	total + buyOffers[i].size
			table.rows[row].classList.add("buyBook");
			createCells(table.rows[row++], buyOffers[i].price.toFixed(1), buyOffers[i].size, total);			
		}
	}
}

export function popPositions(tableElement, data){

	if(data.length > 0) {
		data.reverse();		
		cleanTable(tableElement);
		const table					=	tableElement;	
	
		for (let i = 0; i < data.length; i++) {

			const row 				=	table.insertRow(0);
			const qtyFormated		=	qtyFormat(data[i].currentQty, data[i].currency);
			const currency 			=	data[i].quoteCurrency == "USD" ? data[i].quoteCurrency : "XBT"
			const valueFormated		=	totalFormat(qtyFormated, data[i].avgEntryPrice, data[i].currency);
			const decimals			=	data[i].currency == "USDt" ? 4 : 2

			row.insertCell(0).innerHTML	    	=	data[i].symbol;
			row.insertCell(1).innerHTML	    	=	`${qtyFormated.toFixed(decimals)}  ${currency}`;
			row.insertCell(2).innerHTML	    	=	valueFormated.toFixed(2);
			row.insertCell(3).innerHTML	    	=	data[i].avgEntryPrice.toFixed(2);
			row.insertCell(4).innerHTML	    	=	data[i].liquidationPrice.toFixed(2);
			row.insertCell(5).innerHTML	    	=	(data[i].unrealisedPnl / 1000000).toFixed(2);
			row.insertCell(6).innerHTML	    	=	(data[i].rebalancedPnl / 1000000).toFixed(2);
		}	
	}
}

export function popOpenOrders(tableElement, data, bitmex){

	if(data.length == 0){
		cleanTable(tableElement);
	}

	else if(data.length > 0) {
		data.reverse();
		cleanTable(tableElement);
		const thead				=	tableElement;
		const header			=	thead.createTHead();
		const row 				=	header.insertRow(0);
		const columnTitle = ["Ticker","Volume","Valor","Preço","Preenchido","Restante","Status","Cancelar"]
		createHeaders(row, columnTitle);
		const table				=	thead.createTBody();
	
		for (let i = 0; i < data.length; i++) {

			const row 				=	table.insertRow(0);
			const qtyFormated		=	qtyFormat(data[i].orderQty, data[i].settlCurrency);
			const currency 			=	data[i].currency == "USD" ? data[i].currency : "XBT"
			const valueFormated		=	totalFormat(qtyFormated, data[i].price, data[i].settlCurrency);
			const decimals			=	data[i].settlCurrency == "USDt" ? 4 : 2

			row.insertCell(0).innerHTML	    	=	data[i].symbol;
			row.insertCell(1).innerHTML	    	=	`${qtyFormated.toFixed(decimals)}  ${currency}`;
			row.insertCell(2).innerHTML	    	=	valueFormated.toFixed(2);
			row.insertCell(3).innerHTML	    	=	data[i].price.toFixed(2);
			row.insertCell(4).innerHTML	    	=	qtyFormat(data[i].cumQty, data[i].settlCurrency).toFixed(decimals);
			row.insertCell(5).innerHTML	    	=	qtyFormat(data[i].leavesQty, data[i].settlCurrency).toFixed(decimals);
			row.insertCell(6).innerHTML	    	=	data[i].ordStatus;
			row.insertCell(7).innerHTML	    	=	`<button value='${data[i].orderID}'> X </button>`;

            row.querySelector('button').onclick = async (event) => {
				await bitmex.cancelOpenOrders("cancelOpenOrders", event.target.value);
				popOpenOrders(mainTable, await bitmex.get("getOpenOrders"), bitmex);
            };
		}	
	}
}

export function popOrders(tableElement, data){

	if(data.length > 0) {
		cleanTable(tableElement);
		const thead				=	tableElement;
		const header			=	thead.createTHead();
		const row 				=	header.insertRow(0);
		const columnTitle = ["Ticker","Volume","Preço","Preenchido","Tipo","Status","Data"]
		createHeaders(row, columnTitle);
		const table				=	thead.createTBody();
	
		for (let i = 0; i < data.length; i++) {

			const row 				=	table.insertRow(0);
			const qtyFormated		=	qtyFormat(data[i].orderQty, data[i].settlCurrency);
			const currency 			=	data[i].currency == "USD" ? data[i].currency : "XBT"
			const cumQtyFormated	=	qtyFormat(data[i].cumQty, data[i].settlCurrency);
			const decimals			=	data[i].settlCurrency == "USDt" ? 4 : 2

			row.insertCell(0).innerHTML	    	=	data[i].symbol;
			row.insertCell(1).innerHTML	    	=	`${qtyFormated.toFixed(decimals)}  ${currency}`;
			row.insertCell(2).innerHTML	    	=	data[i].price.toFixed(2);
			row.insertCell(3).innerHTML	    	=	`${cumQtyFormated.toFixed(decimals)}  ${currency}`;
			row.insertCell(4).innerHTML	    	=	`${data[i].side} ${data[i].ordType} `;
			row.insertCell(5).innerHTML	    	=	data[i].ordStatus;
			row.insertCell(6).innerHTML			=	new Date(data[i].timestamp).toLocaleDateString();
			
		}	
	}
}

export function popWalletHistory(tableElement, data){

	if(data.length > 0) {
		data.reverse();		
		cleanTable(tableElement);
		const thead				=	tableElement;
		const header			=	thead.createTHead();
		const row 				=	header.insertRow(0);
		const columnTitle = ["Data","Descrição","Quantidade","Taxa","Endereço","Status","Saldo"]
		createHeaders(row, columnTitle);
		const table				=	thead.createTBody();
	
		for (let i = 0; i < data.length; i++) {

			const row 				=	table.insertRow(0);

			row.insertCell(0).innerHTML			=	new Date(data[i].timestamp).toLocaleDateString();
			row.insertCell(1).innerHTML	    	=	data[i].transactType;
			row.insertCell(2).innerHTML	    	=	data[i].amount;
			row.insertCell(3).innerHTML	    	=	data[i].fee;
			row.insertCell(4).innerHTML	    	=	data[i].address;
			row.insertCell(5).innerHTML	    	=	data[i].transactStatus;
			row.insertCell(6).innerHTML	    	=	data[i].walletBalance / 100000000;
		}	
	}
}

export function createTableRows(tableElement, rows){
	const table					=	tableElement;
	    
	for (let i = 0; i <= rows; i++) {

		const row 				=	table.insertRow(i);
		
		row.insertCell(0);
		row.insertCell(1);
		row.insertCell(2);

		row.cells[0].classList.toggle('row');
		row.cells[1].classList.toggle('row');
		row.cells[2].classList.toggle('row');
		
	}
}
