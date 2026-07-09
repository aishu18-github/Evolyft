// Import mocks first to ensure they apply globally
import { mockPrisma } from "../mocks/prisma";
import { registerUser, loginUser } from "@/actions/auth";
import { signIn } from "@/auth";

// Mock next-auth signIn function specifically
jest.mock("@/auth", () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

describe("Authentication Server Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should successfully register a new user", async () => {
      // Mock that user doesn't exist
      mockPrisma.user.findUnique.mockResolvedValue(null);
      // Mock user creation success
      mockPrisma.user.create.mockResolvedValue({
        id: "new-user-uuid",
        name: "Test Scholar",
        email: "scholar@evolyft.com",
      });

      const formData = new FormData();
      formData.append("name", "Test Scholar");
      formData.append("email", "scholar@evolyft.com");
      formData.append("password", "strongpassword123");

      const result = await registerUser(null, formData);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "scholar@evolyft.com" },
      });
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });

    it("should fail validation if email is missing", async () => {
      const formData = new FormData();
      formData.append("password", "password123");

      const result = await registerUser(null, formData);

      expect(result).toEqual({ error: "Email and password are required." });
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it("should fail validation if password is under 6 characters", async () => {
      const formData = new FormData();
      formData.append("email", "scholar@evolyft.com");
      formData.append("password", "123");

      const result = await registerUser(null, formData);

      expect(result).toEqual({ error: "Password must be at least 6 characters." });
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it("should fail if user email already exists in database", async () => {
      // Mock user existing
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "existing-uuid",
        email: "scholar@evolyft.com",
      });

      const formData = new FormData();
      formData.append("email", "scholar@evolyft.com");
      formData.append("password", "password123");

      const result = await registerUser(null, formData);

      expect(result).toEqual({ error: "An account with this email already exists." });
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe("loginUser", () => {
    it("should call next-auth signIn with credentials provider on valid login", async () => {
      const mockSignIn = signIn as jest.Mock;
      mockSignIn.mockResolvedValue({ success: true });

      const formData = new FormData();
      formData.append("email", "scholar@evolyft.com");
      formData.append("password", "password123");

      const result = await loginUser(null, formData);

      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        email: "scholar@evolyft.com",
        password: "password123",
        redirect: false,
      });
      expect(result).toEqual({ success: true });
    });

    it("should return error if email or password are missing", async () => {
      const formData = new FormData();
      formData.append("email", "scholar@evolyft.com");

      const result = await loginUser(null, formData);

      expect(result).toEqual({ error: "Email and password are required." });
      expect(signIn).not.toHaveBeenCalled();
    });
  });
});
