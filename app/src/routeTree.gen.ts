/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LogoutImport } from './routes/logout'

// Create Virtual Routes

const IndexLazyImport = createFileRoute('/')()
const AppBoardIdLazyImport = createFileRoute('/app/$boardId')()

// Create/Update Routes

const LogoutRoute = LogoutImport.update({
  path: '/logout',
  getParentRoute: () => rootRoute,
} as any)

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const AppBoardIdLazyRoute = AppBoardIdLazyImport.update({
  path: '/app/$boardId',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/app.$boardId.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/logout': {
      preLoaderRoute: typeof LogoutImport
      parentRoute: typeof rootRoute
    }
    '/app/$boardId': {
      preLoaderRoute: typeof AppBoardIdLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexLazyRoute,
  LogoutRoute,
  AppBoardIdLazyRoute,
])

/* prettier-ignore-end */
