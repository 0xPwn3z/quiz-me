import { useLiveQuery } from "dexie-react-hooks";
import { useCallback } from "react";
import { db } from "../db/database";
import type { StoredDeck } from "../types";

export function useDecks() {
  const decks = useLiveQuery(() => db.decks.toArray(), []) ?? [];

  const decksById = useLiveQuery(async () => {
    const all = await db.decks.toArray();
    const map: Record<string, StoredDeck> = {};
    for (const d of all) map[d.id] = d;
    return map;
  }, []) ?? {};

  const saveDeck = useCallback(async (deck: StoredDeck) => {
    await db.decks.put(deck);
  }, []);

  const deleteDeck = useCallback(async (id: string) => {
    await db.transaction("rw", db.decks, db.questionStats, async () => {
      await db.decks.delete(id);
      const stats = await db.questionStats
        .where("compositeKey")
        .startsWith(id + ":")
        .toArray();
      for (const s of stats) {
        await db.questionStats.delete(s.compositeKey);
      }
    });
  }, []);

  const importBackupDecks = useCallback(async (decks: Record<string, StoredDeck>) => {
    await db.transaction("rw", db.decks, async () => {
      for (const d of Object.values(decks)) {
        await db.decks.put(d);
      }
    });
  }, []);

  return { decks, decksById, saveDeck, deleteDeck, importBackupDecks };
}
