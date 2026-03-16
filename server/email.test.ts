import { describe, it, expect } from "vitest";

describe("Email Configuration", () => {
  it("should have OWNER_EMAIL configured", () => {
    const ownerEmail = process.env.OWNER_EMAIL;
    
    expect(ownerEmail).toBeDefined();
    expect(ownerEmail).toBe("queenofpeace323@gmail.com");
    expect(ownerEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it("should validate email format", () => {
    const email = process.env.OWNER_EMAIL;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    expect(email).toMatch(emailRegex);
  });
});
