"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import { useTheme } from "next-themes";

import { corplang } from "@/lib/corplang-lang";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
};

export function CodeEditor({ value, onChange, onRun }: Props) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;

  const extensions = useMemo(
    () => [
      corplang(),
      EditorView.lineWrapping,
      Prec.highest(
        keymap.of([
          {
            key: "Mod-Enter",
            preventDefault: true,
            run: () => {
              onRunRef.current?.();
              return true;
            },
          },
        ]),
      ),
    ],
    [],
  );

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      theme={mounted && resolvedTheme === "dark" ? "dark" : "light"}
      extensions={extensions}
      height="460px"
      basicSetup={{
        foldGutter: false,
        highlightActiveLine: true,
        highlightActiveLineGutter: true,
        tabSize: 4,
        indentOnInput: false,
      }}
      className="overflow-hidden rounded-xl border border-border"
    />
  );
}
