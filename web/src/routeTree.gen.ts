import { Route as rootRoute } from './routes/__root';
import { Route as PackagesAndLabelsCreateRoute } from './routes/packages-and-labels/create';
import { Route as PackagesAndLabelsIdRoute } from './routes/packages-and-labels/$id';
import { Route as PartnersIndexRoute } from './routes/partners/index';
import { Route as PackagesAndLabelsIndexRoute } from './routes/packages-and-labels/index';

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/packages-and-labels/': {
      parentRoute: typeof rootRoute;
    };
    '/partners/': {
      parentRoute: typeof rootRoute;
    };
    '/packages-and-labels/$id': {
      parentRoute: typeof rootRoute;
    };
    '/packages-and-labels/create': {
      parentRoute: typeof rootRoute;
    };
  }
}

Object.assign(PackagesAndLabelsIndexRoute.options, {
  path: '/packages-and-labels/',
  getParentRoute: () => rootRoute,
});

Object.assign(PartnersIndexRoute.options, {
  path: '/partners/',
  getParentRoute: () => rootRoute,
});

Object.assign(PackagesAndLabelsIdRoute.options, {
  path: '/packages-and-labels/$id',
  getParentRoute: () => rootRoute,
});

Object.assign(PackagesAndLabelsCreateRoute.options, {
  path: '/packages-and-labels/create',
  getParentRoute: () => rootRoute,
});

export const routeTree = rootRoute.addChildren([
  PackagesAndLabelsIndexRoute,
  PartnersIndexRoute,
  PackagesAndLabelsIdRoute,
  PackagesAndLabelsCreateRoute,
]);
