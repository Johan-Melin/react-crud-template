import { describe, expect, it } from "vitest";
import { createNoteSchema } from "./schema.js";

describe("createNoteSchema", () => {
  it("accepts trimmed non-empty note text", () => {
    const result = createNoteSchema.parse({
      text: "  Hello world  ",
    });

    expect(result).toEqual({
      text: "Hello world",
    });
  });

  it("rejects empty note text after trimming", () => {
    const result = createNoteSchema.safeParse({
      text: "   ",
    });

    expect(result.success).toBe(false);
  });

  it("rejects note text above the max length", () => {
    const result = createNoteSchema.safeParse({
      text: "a".repeat(5001),
    });

    expect(result.success).toBe(false);
  });
});
