import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useTheme } from "./useTheme";

describe("useTheme", () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    // Reset DOM classList
    document.documentElement.className = "";
  });

  it("should initialize with theme-organic default", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("theme-organic");
    // Under test, requestAnimationFrame might run asynchronously, so let's verify initial state
  });

  it("should toggle the theme", () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.theme).toBe("theme-retro");
    expect(document.documentElement.classList.contains("theme-retro")).toBe(true);
    expect(localStorage.getItem("doeja-theme")).toBe("theme-retro");
  });
});
