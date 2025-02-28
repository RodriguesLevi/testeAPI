import Route from '@ioc:Adonis/Core/Route'

// Public routes
Route.group(() => {
  // Auth routes
  Route.post('/login', 'AuthController.login')

  // Transaction routes (public)
  Route.post('/transactions', 'TransactionController.store')
}).prefix('api')

// Protected routes
Route.group(() => {
  // Auth routes
  Route.post('/logout', 'AuthController.logout')
  Route.get('/me', 'AuthController.me')

  // User management routes (ADMIN, MANAGER)
  Route.group(() => {
    Route.get('/', 'UserController.index')
    Route.post('/', 'UserController.store')
    Route.get('/:id', 'UserController.show')
    Route.put('/:id', 'UserController.update')
    Route.delete('/:id', 'UserController.destroy')
  })
    .prefix('/users')
    .middleware(['auth', 'role:ADMIN,MANAGER'])

  // Product management routes (ADMIN, MANAGER, FINANCE)
  Route.group(() => {
    Route.get('/', 'ProductController.index')
    Route.post('/', 'ProductController.store').middleware(['role:ADMIN,MANAGER,FINANCE'])
    Route.get('/:id', 'ProductController.show')
    Route.put('/:id', 'ProductController.update').middleware(['role:ADMIN,MANAGER,FINANCE'])
    Route.delete('/:id', 'ProductController.destroy').middleware(['role:ADMIN,MANAGER,FINANCE'])
  })
    .prefix('/products')
    .middleware(['auth'])

  // Gateway management routes (ADMIN only)
  Route.group(() => {
    Route.get('/', 'GatewayController.index')
    Route.get('/:id', 'GatewayController.show')
    Route.put('/:id', 'GatewayController.update')
    Route.put('/:id/toggle-active', 'GatewayController.toggleActive')
    Route.put('/:id/priority', 'GatewayController.updatePriority')
  })
    .prefix('/gateways')
    .middleware(['auth', 'role:ADMIN'])

  // Client routes
  Route.group(() => {
    Route.get('/', 'ClientController.index')
    Route.get('/:id', 'ClientController.show')
    Route.get('/:id/transactions', 'ClientController.showWithTransactions')
  })
    .prefix('/clients')
    .middleware(['auth'])

  // Transaction routes (protected)
  Route.group(() => {
    Route.get('/', 'TransactionController.index')
    Route.get('/:id', 'TransactionController.show')
    Route.post('/:id/refund', 'TransactionController.refund').middleware(['role:ADMIN,FINANCE'])
  })
    .prefix('/transactions')
    .middleware(['auth'])
})
  .prefix('api')
  .middleware('auth')
