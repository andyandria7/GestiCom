<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->group('api', function($routes) {
    $routes->group('admins', function($routes){
        $routes->post('create', 'Admin\AuthController::create');

        $routes->get('showDeposits', 'Admin\PaymentsAPI::showDeposits');
        $routes->post('validateDeposit/(:num)', 'Admin\PaymentsAPI::validateDeposit/$1'); 
        $routes->post('rejectDeposit/(:num)', 'Admin\PaymentsAPI::rejectDeposit/$1'); 

        $routes->get('showWithdrawals', 'Admin\PaymentsAPI::showWithdrawals');
        $routes->post('validateWithdrawal/(:num)', 'Admin\PaymentsAPI::validateWithdrawal/$1'); 
        $routes->post('rejectWithdrawal/(:num)', 'Admin\PaymentsAPI::rejectWithdrawal/$1'); 

        $routes->get('showPayments', 'Admin\PaymentsAPI::showPayments');
        $routes->post('validatePayment/(:num)', 'Admin\PaymentsAPI::validatePayment/$1'); 
        $routes->post('rejectPayment/(:num)', 'Admin\PaymentsAPI::rejectPayment/$1'); 

    });
    $routes->group('products', function ($routes) {
        $routes->post('create', 'Users\ProductController::create');
        $routes->get('list', 'Users\ProductController::index');
        $routes->get('show/(:num)', 'Users\ProductController::show/$1');
        $routes->post('update/(:num)', 'Users\ProductController::update/$1');
        $routes->delete('delete/(:num)', 'Users\ProductController::delete/$1');
    });
    $routes->group('packs', function ($routes) {
        $routes->post('create', 'Users\PackController::create');
        $routes->get('list', 'Users\PackController::listPacks');
        $routes->get('show/(:num)', 'Users\PackController::showPack/$1');
        $routes->post('update/(:num)', 'Users\PackController::update/$1');
        $routes->delete('delete/(:num)', 'Users\PackController::delete/$1');
        $routes->get('getProgress/(:num)', 'Users\PackController::progress/$1');
    });
    $routes->group('investments', function ($routes) {
        $routes->post('create', 'Users\InvestmentController::create');
        $routes->get('list', 'Users\InvestmentController::listInvestments', ['filter' => 'jwt']);
        $routes->get('show/(:num)', 'Users\InvestmentController::show/$1');
        $routes->post('update/(:num)', 'Users\InvestmentController::update/$1');
        $routes->delete('delete/(:num)', 'Users\InvestmentController::delete/$1');
    });
    $routes->group('users', function ($routes) {
        $routes->post('create', 'Users\AuthController::register');
        $routes->post('login', 'Users\AuthController::login');
        $routes->get('edit/(:num)', 'Users\AuthController::edit/$1', ['filter' => 'jwt']);
        $routes->put('update/(:num)', 'Users\AuthController::update/$1', ['filter' => 'jwt']);
        $routes->post('upload-profile-image/(:num)', 'Users\AuthController::uploadProfileImage/$1', ['filter' => 'jwt']);
        $routes->post('upload-cin-image/(:num)', 'Users\AuthController::uploadCINImage/$1', ['filter' => 'jwt']);
    });
    $routes->group('wallets', ['filter' => 'jwt'], function ($routes) {
        $routes->get('show', 'Users\WalletController::index');
    });
    $routes->group('delivery', function ($routes) {
        $routes->get('', 'Deliveries\DeliveryController::index');
        $routes->post('create', 'Deliveries\DeliveryController::create');
        $routes->delete('(:num)', 'Deliveries\DeliveryController::delete/$1');
        $routes->post('validate/(:num)', 'Deliveries\DeliveryController::validateDelivery/$1');
    });
    $routes->group('clients', function ($routes) {
        $routes->resource('create', ['controller' => 'Client\ClientController']);
        $routes->get('list', 'Client\ClientController::list');
        $routes->delete('(:num)', 'Client\ClientController::delete/$1');
    });
    $routes->group('transactions', ['filter' => 'jwt'], function ($routes) {
        $routes->post('deposit', 'Users\TransactionController::depositRequest');
        $routes->post('payment', 'Users\TransactionController::paymentRequest');
        $routes->post('withdrawal', 'Users\TransactionController::withdrawalRequest');
        $routes->get('show', 'Users\TransactionController::getTransactions');
    });
    $routes->group('notifications', ['filter' => 'jwt'], function($routes) {
        $routes->get('get', 'Admin\PaymentsAPI::getNotifications');
        $routes->post('markAllRead', 'Admin\PaymentsAPI::markAllRead');
    });
    $routes->group('stats', function($routes) {
        $routes->get('dashboard', 'Stat\StatController::index');
    });
});

//-------------------------------------------------------------------------------------An'i Shindo--------------------------------------------------------------------------------------------------
$routes->post('auth/login', 'Admin\AuthController::login');
$routes->get('auth/login', 'Admin\AuthController::login');
$routes->get('Dashboard', 'Admin\AuthController::Dashboard');
$routes->get('auth/logout', 'Admin\AuthController::logout');

$routes->group('api', function($routes) {
    $routes->group('products', function($routes) {
        $routes->get('/', 'Admin\ProductController::index');         
        $routes->get('(:num)', 'Admin\ProductController::show/$1');         
        $routes->post('/', 'Admin\ProductController::create');              
        $routes->put('(:num)', 'Admin\ProductController::update/$1');
        $routes->post('(:num)', 'Admin\ProductController::updatePost/$1');       
        $routes->delete('(:num)', 'Admin\ProductController::delete/$1');    
        $routes->options('(:any)', 'Admin\ProductController::options');     
    });

    $routes->group('packs', function($routes) {
        $routes->get('/', 'Admin\PackController::index');                   
        $routes->get('(:num)', 'Admin\PackController::show/$1');            
        $routes->post('/', 'Admin\PackController::create');                 
        $routes->put('(:num)', 'Admin\PackController::update/$1');         
        $routes->delete('(:num)', 'Admin\PackController::delete/$1');       
        $routes->options('(:any)', 'Admin\PackController::options');      
    });
});

$routes->get('commercials', 'Admin\CommercialController::index');
$routes->put('commercials/(:num)', 'Admin\CommercialController::update/$1');
$routes->get('retraits', 'Admin\RetraitsController::index');


$routes->get('investisseurs', 'Admin\InvestisseurController::index');
$routes->put('investisseurs/(:num)', 'Admin\InvestisseurController::update/$1');
$routes->get('commercials', 'Admin\CommercialController::index');
$routes->put('commercials/(:num)', 'Admin\CommercialController::update/$1');

$routes->get('api/admins/showDeposits', 'Admin\TransactionsController::showDeposits');


//-------------------------------------------------------------------------------------An'i Fifa--------------------------------------------------------------------------------------------------
$routes->options('(:any)', 'CorsController::preflight');

$routes->get('user', 'UserController::index');
$routes->post('auth/login', 'AuthController::login');
$routes->post('Dashboard', 'AuthController::Dashboard');


$routes->get('dashboard', 'DashboardController::index');
$routes->get('roles', 'RoleController::index');


// Packs
$routes->get('packs', 'PackController::index');
$routes->get('packs/(:num)', 'PackController::show/$1');
$routes->post('packs', 'PackController::create');
$routes->put('packs/(:num)', 'PackController::update/$1');
$routes->delete('packs/(:num)', 'PackController::delete/$1');

// Alias routes for packs to match frontend expectations

// Produits




$routes->get('retraits', 'RetraitsController::index');
 
