import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Mock global TextEncoder and TextDecoder (required by jose/next-auth under JSDOM)
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder as any;
}

// Global Mock for next-auth to avoid loading ESM modules inside node_modules
jest.mock("next-auth", () => ({
  AuthError: class AuthError extends Error {
    type: string;
    constructor(message?: string) {
      super(message);
      this.type = "CredentialsSignin";
    }
  },
}));

// Mock global Response class for JSDOM/Node environments
if (typeof global.Response === "undefined") {
  global.Response = class Response {
    headers: any;
    constructor() {
      this.headers = new Map();
    }
    static redirect(url: string | URL) {
      const res = new Response();
      res.headers.set("Location", url.toString());
      return res;
    }
  } as any;
}

// Global Mock for Next.js Navigation Router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    replace: jest.fn(),
  })),
  usePathname: jest.fn(() => "/dashboard"),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Global Mock for Auth.js (NextAuth v5)
jest.mock("@/auth", () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        id: "test-user-id",
        name: "Test User",
        email: "test@example.com",
      },
    })
  ),
  signIn: jest.fn(() => Promise.resolve({ success: true })),
  signOut: jest.fn(() => Promise.resolve({ success: true })),
  handlers: { GET: jest.fn(), POST: jest.fn() },
}));

// Mock window.matchMedia for components with responsive layouts
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
