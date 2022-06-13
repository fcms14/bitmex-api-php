<?php

require("bitmex.php");	

if($_SERVER['REQUEST_METHOD'] === 'POST') {
    $key1           =   $_POST["apiID"];
    $key2           =   $_POST["apiSecret"];
    $testnet        =   $_POST["testnet"];
    $bitmex         =   new bitmex($key1, $key2, $testnet);

    switch ($_POST["endpoint"]) {
        case "getOrderBook":
            print_r(json_encode($bitmex->getOrderBook()));
            break;
        case "getOpenOrders":
            print_r(json_encode($bitmex->getOpenOrders()));
            break;
        case "getOpenPositions":
            print_r(json_encode($bitmex->getOpenPositions()));
            break;
        case "getOrders":
            print_r(json_encode($bitmex->getOrders()));
            break;
        case "getWalletHistory":
            print_r(json_encode($bitmex->getWalletHistory()));
            break;
        case "createOrder":
            $type       =   $_POST["type"];
            $side       =   $_POST["side"];
            $price      =   $_POST["price"];
            $quantity   =   $_POST["quantity"];        
            print_r(json_encode($bitmex->createOrder($type, $side, $price, $quantity)));
            break;
        case "cancelOpenOrders":
            $orderID        = $_POST["orderID"];    
            print_r(json_encode($bitmex->cancelOpenOrders($orderID)));
    }
}