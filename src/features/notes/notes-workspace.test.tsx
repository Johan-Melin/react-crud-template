import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NotesWorkspace } from "./notes-workspace.tsx";

const api = vi.hoisted(() => ({
  createNote: vi.fn(),
  deleteNote: vi.fn(),
  getNotes: vi.fn(),
  updateNote: vi.fn(),
}));

vi.mock("./api.ts", () => api);

function renderWithQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <NotesWorkspace />
    </QueryClientProvider>,
  );
}

describe("NotesWorkspace", () => {
  beforeEach(() => {
    api.getNotes.mockResolvedValue([]);
    api.createNote.mockResolvedValue({
      id: "note-1",
      userId: "user-1",
      text: "Created note",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("creates a note and refreshes the list", async () => {
    api.getNotes.mockResolvedValueOnce([]).mockResolvedValueOnce([
      {
        id: "note-1",
        userId: "user-1",
        text: "Created note",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    renderWithQueryClient();

    expect(
      await screen.findByText(/no notes yet\. create one above/i),
    ).toBeTruthy();

    await userEvent.type(
      screen.getByLabelText(/new note/i),
      "Created note",
    );
    await userEvent.click(screen.getByRole("button", { name: /create note/i }));

    await waitFor(() => {
      expect(api.createNote).toHaveBeenCalledTimes(1);
      expect(api.createNote.mock.calls[0]?.[0]).toBe("Created note");
    });

    expect(await screen.findByText("Created note")).toBeTruthy();
  });
});
