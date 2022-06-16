<?php

require("bitmex.php");	

if($_SERVER['REQUEST_METHOD'] === 'POST') {
    $key1           =   $_POST["apiID"];
    $key2           =   $_POST["apiSecret"];
    $testnet        =   $_POST["testnet"];
    $bitmex         =   new bitmex($key1, $key2, $testnet);

    switch ($_POST["endpoint"]) {
        case "getInstrumentsActive":
            print_r(json_encode($bitmex->getInstrumentsActive()));
            break;
        case "getOrderBook":
            $symbol       =   $_POST["symbol"];
            print_r(json_encode($bitmex->getOrderBook($symbol)));
            break;
        case "getMargin":
            print_r(json_encode($bitmex->getMargin()));
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
        case "requestWithdrawal":
            $twoFactor      = $_POST["twoFactor"];    
            $amount         = $_POST["amount"];    
            $walletAddress  = $_POST["walletAddress"];    
            $fee            = $_POST["fee"];    
            $note           = $_POST["note"];    
            print_r(json_encode($bitmex->requestWithdrawal($twoFactor, $amount, $walletAddress, $fee, $note)));
    }
}