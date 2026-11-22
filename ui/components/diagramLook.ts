// The Diagram look setting (server.ts DIAGRAM_SETTINGS), as Diagram reads it.
import { useSettings } from "@get-bb/plugin-sdk/app";
import type { DIAGRAM_SETTINGS } from "../../server";
import { DEFAULT_DIAGRAM_LOOK, diagramLook, type DiagramLook } from "./sketch";

const DIAGRAM_LOOK: keyof typeof DIAGRAM_SETTINGS = "diagramLook";
/**
 * The look a diagram last drew with, kept in localStorage too: BB answers
 * useSettings after the first blocks of a fresh page have mounted, and they
 * would draw hand-drawn, then again in the chosen look.
 */
const LOOK_STORAGE = "bb.genui.diagramLook";
let lastLook = readLook();

function readLook(): DiagramLook {
  try {
    return diagramLook(localStorage.getItem(LOOK_STORAGE));
  } catch {
    return DEFAULT_DIAGRAM_LOOK;
  }
}

function rememberLook(look: DiagramLook): void {
  if (look === lastLook) return;
  lastLook = look;
  try {
    if (look === DEFAULT_DIAGRAM_LOOK) localStorage.removeItem(LOOK_STORAGE);
    else localStorage.setItem(LOOK_STORAGE, look);
  } catch {
    // Storage unavailable: a fresh page draws hand-drawn until BB answers.
  }
}

/** The look diagrams are drawn in; the caller re-renders when it changes. */
export function useDiagramLook(): DiagramLook {
  const { values } = useSettings();
  if (values !== undefined) rememberLook(diagramLook(values[DIAGRAM_LOOK]));
  return lastLook;
}
