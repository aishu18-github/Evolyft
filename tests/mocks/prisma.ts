export const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  streakData: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  roadmap: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  milestone: {
    update: jest.fn(),
  },
  studySession: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  resource: {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  activityLog: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

// Mock the actual lib/prisma path globally
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: mockPrisma,
}));
