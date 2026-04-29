import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AppHomePage } from "./routes/app-home-page.tsx";
import { HomePage } from "./routes/home-page.tsx";
import { RootLayout } from "./routes/root-layout.tsx";
import { SignInPage } from "./routes/sign-in-page.tsx";
import { SignUpPage } from "./routes/sign-up-page.tsx";

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-in",
  component: SignInPage,
});

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-up",
  component: SignUpPage,
});

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app",
  component: AppHomePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  signInRoute,
  signUpRoute,
  appRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
