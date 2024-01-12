/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import CategoriesController from '#controllers/categories_controller'
import PackagesAndLabelsController from '#controllers/packages_and_labels_controller'
import PartnersController from '#controllers/partners_controller'
import UomsController from '#controllers/uoms_controller'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.resource('/partners', PartnersController).apiOnly()
    router.resource('/packages-and-labels', PackagesAndLabelsController).apiOnly()
    router.resource('/uoms', UomsController).apiOnly()
    router.resource('/categories', CategoriesController).apiOnly()
  })
  .prefix('/api')
