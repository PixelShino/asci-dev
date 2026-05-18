"use client";

import { useState, FormEvent } from "react";
import { useGlitch } from "@/components/providers/glitch-provider";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

type AIProvider = "auto" | "gemini";

const STYLES = {
  panel:
    "border border-purple-400/20 bg-white dark:bg-zinc-950/40 p-4 space-y-4 font-mono transition-colors duration-300",
  header:
    "flex flex-wrap items-center justify-between gap-3 border-b border-purple-400/10 pb-2.5",
  title:
    "text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-2 select-none",
  controls: "flex items-center gap-3",
  selectorRow:
    "flex gap-1.5 text-[9px] bg-zinc-100 dark:bg-zinc-900/60 p-1 border border-purple-400/10 rounded-xs text-zinc-500 select-none",
  selectorBtn:
    "cursor-pointer uppercase px-1 rounded-xs font-bold transition-colors",

  consoleBox:
    "bg-zinc-50 dark:bg-zinc-950 border border-purple-400/10 p-3 min-h-[100px] flex flex-col justify-center gap-1 text-[11px]",
  consoleLine:
    "whitespace-pre-wrap text-purple-600 dark:text-purple-400 leading-relaxed",
  placeholder:
    "text-zinc-400 dark:text-zinc-600 italic text-center select-none",

  form: "flex items-center gap-3 border border-purple-400/20 bg-zinc-50 dark:bg-zinc-950 px-4 py-2.5 focus-within:border-purple-500/50 transition-colors rounded-xs relative group",
  prefix:
    "text-purple-500 dark:text-purple-400 text-sm font-bold select-none shrink-0",
  input:
    "flex-1 bg-transparent border-none outline-none text-sm text-zinc-800 dark:text-zinc-100 font-mono placeholder-zinc-400 dark:placeholder-zinc-600 py-0",
  sendBtn:
    "flex items-center justify-center text-sm font-bold p-1 -mr-1 rounded-xs transition-all duration-200 cursor-pointer disabled:opacity-20 select-none",
};

export function AiAssistant() {
  const { mode } = useGlitch();
  const { resolvedTheme } = useTheme();
  const t = useTranslations("AiAssistant");

  const [provider, setProvider] = useState<AIProvider>("auto");
  const [inputValue, setInputValue] = useState("");
  const [aiStatus, setAiStatus] = useState<
    "IDLE" | "LOADING" | "COMPLETED" | "ERROR"
  >("IDLE");
  const [aiResponse, setAiResponse] = useState<string[]>([]);
  const [usedSource, setUsedSource] = useState("");

  const triggerAiQuery = async (promptToSend: string) => {
    setAiResponse([]);
    setUsedSource("");
    setAiStatus("LOADING");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: resolvedTheme || "dark",
          mode: mode || "webgl",
          provider: provider,
          userPrompt: promptToSend,
        }),
      });

      if (!res.ok) throw new Error("API_ERROR");

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setAiResponse(data.logs || []);
      setUsedSource(data.source || "");
      setAiStatus("COMPLETED");
    } catch (err) {
      console.error(err);
      setAiStatus("ERROR");
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || aiStatus === "LOADING") return;
    triggerAiQuery(inputValue);
    setInputValue("");
  };

  const isInputEmpty = !inputValue.trim();

  return (
    <div className={STYLES.panel}>
      <div className={STYLES.header}>
        <div className={STYLES.title}>
          <span>{">"} COPROCESSOR_AI_ASSISTANT</span>
          {aiStatus === "LOADING" && (
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
          )}
        </div>

        <div className={STYLES.controls}>
          <div className="flex flex-col items-end gap-0.5">
            <div className={STYLES.selectorRow}>
              <span>src:</span>
              {(["auto", "gemini"] as AIProvider[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setProvider(p)}
                  disabled={aiStatus === "LOADING"}
                  className={`${STYLES.selectorBtn} ${provider === p ? "bg-purple-500 text-white dark:text-black font-extrabold" : "hover:text-zinc-800 dark:hover:text-zinc-200"}`}>
                  {p}
                </button>
              ))}
            </div>
            <span className="text-[8px] text-zinc-400 dark:text-zinc-500 select-none tracking-tight font-mono uppercase">
              {provider === "auto" ? "via OpenRouter" : "via Google AI Studio"}
            </span>
          </div>

          <button
            onClick={() => triggerAiQuery("")}
            disabled={aiStatus === "LOADING"}
            className="text-[10px] border border-purple-400/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 hover:bg-purple-500/5 transition-all cursor-pointer rounded-xs select-none h-fit self-start">
            [SYSTEM_SCAN]
          </button>
        </div>
      </div>

      <div className={STYLES.consoleBox}>
        {aiStatus === "IDLE" && (
          <p className={STYLES.placeholder}>{t("placeholder")}</p>
        )}

        {aiStatus === "LOADING" && (
          <p
            className={`${STYLES.placeholder} animate-pulse text-purple-500/70`}>
            {t("loading")}
          </p>
        )}

        {aiStatus === "ERROR" && (
          <p className="text-red-500 font-bold text-center">{t("error")}</p>
        )}

        {aiStatus === "COMPLETED" &&
          aiResponse.map((line, i) => (
            <p key={i} className={STYLES.consoleLine}>
              {line}
            </p>
          ))}

        {aiStatus === "COMPLETED" && usedSource && (
          <div className="text-[8px] text-zinc-400 dark:text-zinc-500 text-right mt-1 border-t border-purple-400/5 pt-1 select-none">
            secure_tunnel_node: {usedSource}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className={STYLES.form}>
        <span className={STYLES.prefix}>guest@ai-core:~$</span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={aiStatus === "LOADING"}
          placeholder={t("input_placeholder")}
          className={STYLES.input}
        />

        <button
          type="submit"
          disabled={isInputEmpty || aiStatus === "LOADING"}
          className={`${STYLES.sendBtn} ${
            isInputEmpty
              ? "text-zinc-400"
              : "text-purple-600 dark:text-purple-400 hover:scale-110 active:scale-95"
          }`}
          title="To send a request">
          <span className="font-sans">➔</span>
        </button>
      </form>
    </div>
  );
}
