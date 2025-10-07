<?php

use App\Controllers\AnagraphicController;

require_once __DIR__ . "/../vendor/autoload.php";

$controller = new AnagraphicController;
$controller->handleRequests();
