import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
  });

  it("should handle conditional class names", () => {
    expect(cn("bg-red-500", false && "text-white", true && "font-bold")).toBe("bg-red-500 font-bold");
  });

  it("should merge conflicting Tailwind classes using tailwind-merge", () => {
    expect(cn("p-4", "p-6")).toBe("p-6");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("should handle empty or undefined inputs", () => {
    expect(cn(undefined, null, "")).toBe("");
  });
});
