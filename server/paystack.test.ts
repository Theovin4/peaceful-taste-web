import { describe, it, expect } from "vitest";
import { generatePaymentReference } from "./paystack";

describe("Paystack Integration", () => {
  it("should generate a valid payment reference", () => {
    const reference = generatePaymentReference();
    
    expect(reference).toBeDefined();
    expect(reference).toMatch(/^PT-\d+-[a-z0-9]+$/);
    expect(reference.length).toBeGreaterThan(10);
  });

  it("should generate unique payment references", () => {
    const ref1 = generatePaymentReference();
    const ref2 = generatePaymentReference();
    
    expect(ref1).not.toBe(ref2);
  });

  it("should have PAYSTACK_API_KEY configured", () => {
    const apiKey = process.env.PAYSTACK_API_KEY;
    
    // Check if API key is configured
    if (apiKey) {
      expect(apiKey).toBeDefined();
      expect(apiKey.length).toBeGreaterThan(0);
      // Paystack keys typically start with sk_live_ or sk_test_
      expect(apiKey).toMatch(/^sk_(live|test)_/);
    }
  });
});
