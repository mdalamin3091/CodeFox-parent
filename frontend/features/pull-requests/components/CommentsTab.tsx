"use client";

import { useState } from "react";
import { MessageSquare, ChevronDown, ChevronRight, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { SeverityPill } from "./SeverityPill";
import type { InlineComment } from "../types";

function InlineCommentItem({ comment }: { comment: InlineComment }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-lg border border-gray-100 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
      >
        {open
          ? <ChevronDown className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
          : <ChevronRight className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />}
        <SeverityPill severity={comment.severity} />
        <span className="text-xs font-medium text-gray-800 dark:text-gray-200 flex-1 truncate">
          {comment.title}
        </span>
        <span className="text-[10px] text-gray-400 flex-shrink-0">line {comment.line}</span>
      </button>

      {open && (
        <div className="border-t border-gray-50 dark:border-gray-800 px-3 pb-3 pt-2.5 space-y-2.5 bg-gray-50/50 dark:bg-gray-800/20">
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{comment.body}</p>

          {comment.proposedFix && (
            <div>
              <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Proposed fix
              </p>
              <pre className="text-xs bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg p-2.5 overflow-x-auto font-mono whitespace-pre-wrap">
                {comment.proposedFix}
              </pre>
            </div>
          )}

          {comment.suggestion && (
            <div>
              <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Suggested replacement
              </p>
              <pre className="text-xs bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg p-2.5 overflow-x-auto font-mono whitespace-pre-wrap">
                {comment.suggestion}
              </pre>
            </div>
          )}

          {comment.agentPrompt && (
            <div className="rounded-lg border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2">
              <p className="text-[11px] font-semibold text-gray-400 mb-0.5">AI agent instruction</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{comment.agentPrompt}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FileGroup({ filePath, comments }: { filePath: string; comments: InlineComment[] }) {
  const [open, setOpen] = useState(true);
  const highs = comments.filter((c) => c.severity === "high").length;

  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2.5 bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 text-left transition-colors"
      >
        {open
          ? <ChevronDown className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
          : <ChevronRight className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />}
        <FileCode className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
        <span className="text-xs font-mono font-medium text-gray-700 dark:text-gray-300 flex-1 truncate">
          {filePath}
        </span>
        <span className="text-[10px] text-gray-400 flex-shrink-0 mr-1.5">
          {comments.length} comment{comments.length !== 1 ? "s" : ""}
        </span>
        {highs > 0 && (
          <span className="inline-flex rounded-full bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-[10px] px-1.5 py-0.5 font-semibold">
            {highs} high
          </span>
        )}
      </button>

      {open && (
        <div className="p-2 space-y-1.5 bg-white dark:bg-gray-900">
          {[...comments]
            .sort((a, b) => a.line - b.line)
            .map((c, i) => <InlineCommentItem key={i} comment={c} />)}
        </div>
      )}
    </div>
  );
}

export function CommentsTab({ inlineComments }: { inlineComments: InlineComment[] }) {
  const byFile = inlineComments.reduce<Record<string, InlineComment[]>>((acc, c) => {
    (acc[c.path] ??= []).push(c);
    return acc;
  }, {});

  if (inlineComments.length === 0) {
    return (
      <div className="py-12 text-center">
        <MessageSquare className="mx-auto h-7 w-7 text-gray-300 dark:text-gray-600 mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">No inline comments</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {Object.entries(byFile)
        .sort(([, a], [, b]) => {
          const rank = (cs: InlineComment[]) =>
            cs.some((c) => c.severity === "high") ? 0 :
            cs.some((c) => c.severity === "medium") ? 1 : 2;
          return rank(a) - rank(b);
        })
        .map(([filePath, comments]) => (
          <FileGroup key={filePath} filePath={filePath} comments={comments} />
        ))}
    </div>
  );
}
