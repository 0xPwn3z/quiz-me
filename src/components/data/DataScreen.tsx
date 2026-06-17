import { useCallback } from "react";
import { useDecks } from "../../hooks/useDecks";
import { useStats } from "../../hooks/useStats";
import { ImportSection } from "./ImportSection";
import { DeckManager } from "./DeckManager";
import { ExportSection } from "./ExportSection";
import { ResetSection } from "./ResetSection";
import { loadSettings, saveSettings, clearAllStorage } from "../../services/storage";
import { generateProgressHtml } from "../../services/htmlExport";
import type { ImportPayload } from "../../types";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function downloadJson(obj: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  downloadBlob(blob, filename);
}

function downloadHtml(html: string, filename: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  downloadBlob(blob, filename);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function DataScreen() {
  const { decks, saveDeck, deleteDeck, importBackupDecks } = useDecks();
  const { stats, questionStats, clearAll: clearAllStats, restoreStats, restoreQuestionStats } = useStats();

  const handleImport = useCallback(
    async (parsed: ImportPayload, name: string) => {
      // Restore progress
      if (parsed.progress) {
        if (parsed.progress.stats) {
          await restoreStats(parsed.progress.stats);
        }
        if (parsed.progress.questionStats) {
          const items = Object.values(parsed.progress.questionStats);
          await restoreQuestionStats(items);
        }
      }
      // Restore settings
      if (parsed.settings) {
        saveSettings(parsed.settings);
      }

      // Backup with decks structure
      if (parsed.decks) {
        await importBackupDecks(parsed.decks);
        return;
      }

      // Single deck import
      const id = "deck_" + generateId();
      await saveDeck({
        id,
        name,
        questions: parsed.questions,
        importedAt: new Date().toISOString(),
      });
    },
    [saveDeck, importBackupDecks, restoreStats, restoreQuestionStats],
  );

  const handleExportProgressHtml = useCallback(() => {
    const html = generateProgressHtml(decks, stats, questionStats);
    downloadHtml(html, "progress.html");
  }, [decks, stats, questionStats]);

  const handleExportBackup = useCallback(() => {
    downloadJson(
      {
        questions: decks.flatMap((d) => d.questions),
        progress: { stats, questionStats },
        settings: loadSettings(),
        decks: Object.fromEntries(decks.map((d) => [d.id, d])),
        exportedAt: new Date().toISOString(),
      },
      "backup.json",
    );
  }, [decks, stats, questionStats]);

  const handleReset = useCallback(async () => {
    await clearAllStats();
    clearAllStorage();
    window.location.reload();
  }, [clearAllStats]);

  return (
    <div className="flex flex-col gap-6">
      <ImportSection onImport={handleImport} />
      <DeckManager decks={decks} onDelete={deleteDeck} />
      <ExportSection
        onExportProgressHtml={handleExportProgressHtml}
        onExportBackup={handleExportBackup}
      />
      <ResetSection onReset={handleReset} />
    </div>
  );
}
