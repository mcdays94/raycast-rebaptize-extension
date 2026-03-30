import { showHUD } from "@raycast/api";
import { readFile, unlink, rename as fsRename } from "fs/promises";
import { join } from "path";
import { UNDO_PATH } from "./instant-runner";

interface UndoState {
  folderPath: string;
  changes: { original: string; renamed: string }[];
  actionName: string;
  timestamp: number;
}

export default async function () {
  try {
    const raw = await readFile(UNDO_PATH, "utf-8");
    const state: UndoState = JSON.parse(raw);

    // Check if the undo state is too old (5 minutes)
    const age = Date.now() - state.timestamp;
    if (age > 5 * 60 * 1000) {
      await showHUD("Undo expired — last rename was more than 5 minutes ago");
      return;
    }

    // Reverse renames (in reverse order to avoid conflicts)
    for (const r of [...state.changes].reverse()) {
      await fsRename(join(state.folderPath, r.renamed), join(state.folderPath, r.original));
    }

    // Delete undo state so it can't be applied twice
    await unlink(UNDO_PATH);

    await showHUD(`Undid "${state.actionName}" — ${state.changes.length} files reverted`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await showHUD("Nothing to undo");
    } else {
      await showHUD(`Undo failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
