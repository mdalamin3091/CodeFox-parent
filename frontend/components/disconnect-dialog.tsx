"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookmarkCheck, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = "keep" | "remove";

interface DisconnectDialogProps {
  repoName: string;
  isPending: boolean;
  onConfirm: (keepContext: boolean) => void;
  onClose: () => void;
}

const OPTIONS = [
  {
    value: "keep" as Option,
    icon: BookmarkCheck,
    iconBg: "bg-orange-100 dark:bg-orange-950/50",
    iconColor: "text-orange-500",
    activeBorder: "border-orange-300 dark:border-orange-700",
    activeBg: "bg-orange-50 dark:bg-orange-950/20",
    radioColor: "#f97316",
    label: "Keep context & disconnect",
    description:
      "Removes the webhook but keeps your Pinecone vectors. Re-connecting later will skip re-indexing and reuse the existing context.",
  },
  {
    value: "remove" as Option,
    icon: Trash2,
    iconBg: "bg-red-100 dark:bg-red-950/50",
    iconColor: "text-red-500",
    activeBorder: "border-red-300 dark:border-red-700",
    activeBg: "bg-red-50 dark:bg-red-950/20",
    radioColor: "#ef4444",
    label: "Remove context & disconnect",
    description:
      "Removes the webhook and permanently deletes all indexed vectors from Pinecone. Re-connecting will re-index from scratch.",
  },
] as const;

export function DisconnectDialog({
  repoName,
  isPending,
  onConfirm,
  onClose,
}: DisconnectDialogProps) {
  const [selected, setSelected] = useState<Option>("keep");

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isPending) onClose();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">
            Disconnect repository
          </DialogTitle>
          <DialogDescription className="text-xs leading-relaxed">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {repoName}
            </span>{" "}
            — choose what happens to your indexed context.
          </DialogDescription>
        </DialogHeader>

        {/* Options */}
        <div className="space-y-2 py-1">
          {OPTIONS.map((opt) => {
            const isActive = selected === opt.value;
            return (
              <button
                key={opt.value}
                disabled={isPending}
                onClick={() => setSelected(opt.value)}
                className={cn(
                  "w-full rounded-xl border p-4 text-left transition-all disabled:opacity-50",
                  isActive
                    ? `${opt.activeBorder} ${opt.activeBg}`
                    : "border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:border-gray-200 dark:hover:border-gray-700"
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Radio indicator */}
                  <div
                    className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                    style={{
                      borderColor: isActive ? opt.radioColor : undefined,
                    }}
                  >
                    {isActive && (
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: opt.radioColor }}
                      />
                    )}
                  </div>

                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={cn(
                        "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
                        opt.iconBg,
                        opt.iconColor
                      )}
                    >
                      <opt.icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                        {opt.label}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <DialogFooter className="gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-xs"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className={cn(
              "h-8 text-xs gap-1.5",
              selected === "remove"
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            )}
            disabled={isPending}
            onClick={() => onConfirm(selected === "keep")}
          >
            {isPending ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Disconnecting…
              </>
            ) : (
              "Disconnect"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
