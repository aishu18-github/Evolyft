import { GET, POST } from "@/app/api/auth/[...nextauth]/route";

describe("NextAuth API Router Endpoint Handlers", () => {
  it("should expose GET and POST handlers as callable functions for auth routes", () => {
    expect(GET).toBeDefined();
    expect(POST).toBeDefined();
    expect(typeof GET).toBe("function");
    expect(typeof POST).toBe("function");
  });
});
