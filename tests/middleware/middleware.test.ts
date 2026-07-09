import { authConfig } from "@/auth.config";

describe("Middleware Route Guard Authorization Checks", () => {
  const authorized = authConfig.callbacks?.authorized;

  if (!authorized) {
    throw new Error("Authorized callback is missing from authConfig");
  }

  it("should deny access to dashboard routes for unauthenticated users", () => {
    const nextUrl = new URL("http://localhost:3000/dashboard");
    const result = authorized({
      auth: null,
      request: { nextUrl } as any,
    });
    expect(result).toBe(false);
  });

  it("should deny access to sub-pages (tracker, roadmaps) for unauthenticated users", () => {
    const trackerUrl = new URL("http://localhost:3000/tracker");
    const roadmapsUrl = new URL("http://localhost:3000/roadmaps");
    
    expect(authorized({ auth: null, request: { nextUrl: trackerUrl } as any })).toBe(false);
    expect(authorized({ auth: null, request: { nextUrl: roadmapsUrl } as any })).toBe(false);
  });

  it("should allow access to dashboard routes for authenticated users", () => {
    const nextUrl = new URL("http://localhost:3000/dashboard");
    const result = authorized({
      auth: { user: { id: "test-user-id", name: "Scholar" } } as any,
      request: { nextUrl } as any,
    });
    expect(result).toBe(true);
  });

  it("should redirect logged-in users away from /login back to dashboard", () => {
    const nextUrl = new URL("http://localhost:3000/login");
    const result = authorized({
      auth: { user: { id: "test-user-id" } } as any,
      request: { nextUrl } as any,
    });

    expect(result).toBeInstanceOf(Response);
    const response = result as Response;
    expect(response.headers.get("Location")).toBe("http://localhost:3000/dashboard");
  });

  it("should redirect logged-in users away from /register back to dashboard", () => {
    const nextUrl = new URL("http://localhost:3000/register");
    const result = authorized({
      auth: { user: { id: "test-user-id" } } as any,
      request: { nextUrl } as any,
    });

    expect(result).toBeInstanceOf(Response);
    const response = result as Response;
    expect(response.headers.get("Location")).toBe("http://localhost:3000/dashboard");
  });

  it("should allow public access to landing page for all users", () => {
    const nextUrl = new URL("http://localhost:3000/");
    const result = authorized({
      auth: null,
      request: { nextUrl } as any,
    });
    expect(result).toBe(true);
  });
});
