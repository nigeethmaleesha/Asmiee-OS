import { initialState } from "@/data/mock";
import type { AppState } from "@/types";

const STORAGE_KEY = "asmiee-os-phase1-state-v2";
const USER_KEY = "asmiee-os-phase1-user-v2";

export const demoRepository = {
  async load(): Promise<AppState> {
    if (typeof window === "undefined") return initialState;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    try { return JSON.parse(raw) as AppState; } catch { return initialState; }
  },
  async save(state: AppState) {
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },
  async reset() {
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
  },
  getSessionUser() {
    return typeof window === "undefined" ? null : window.localStorage.getItem(USER_KEY);
  },
  setSessionUser(userId: string | null) {
    if (typeof window === "undefined") return;
    if (userId) window.localStorage.setItem(USER_KEY, userId);
    else window.localStorage.removeItem(USER_KEY);
  },
};
