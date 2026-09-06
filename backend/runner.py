"""
Execute transpiled CorpLang (= Python) in a short-lived, isolated child process.

This is *light* sandboxing, not a security boundary:
  * separate interpreter process (`-I` isolated mode)
  * hard wall-clock timeout (kills infinite loops)
  * captured & size-capped output
For untrusted public traffic you still want an OS-level sandbox
(container / gVisor / firecracker / seccomp).
"""

from __future__ import annotations

import subprocess
import sys
import tempfile
import time

MAX_OUTPUT = 20_000          # characters returned to the client
DEFAULT_TIMEOUT = 5.0        # seconds of wall-clock per program

_CHILD_TEMPLATE = '''\
import sys, traceback
_src = {src!r}
try:
    exec(compile(_src, "<corplang>", "exec"), {{"__name__": "__main__"}})
except SystemExit:
    pass
except BaseException as _exc:
    # Hide this harness frame; show only frames from the user's program.
    _tb = _exc.__traceback__.tb_next if _exc.__traceback__ else None
    traceback.print_exception(type(_exc), _exc, _tb)
    sys.exit(1)
'''


def _clip(text: str) -> tuple[str, bool]:
    if len(text) > MAX_OUTPUT:
        return text[:MAX_OUTPUT], True
    return text, False


def execute(python_src: str, timeout: float = DEFAULT_TIMEOUT) -> dict:
    """Run `python_src` and return {ok, output, error, truncated, duration_ms}."""
    child = _CHILD_TEMPLATE.format(src=python_src)
    started = time.perf_counter()

    try:
        with tempfile.TemporaryDirectory() as cwd:
            proc = subprocess.run(
                [sys.executable, "-I", "-c", child],
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=cwd,
            )
    except subprocess.TimeoutExpired as exc:
        partial = exc.stdout or ""
        if isinstance(partial, bytes):
            partial = partial.decode("utf-8", "replace")
        clipped, truncated = _clip(partial)
        return {
            "ok": False,
            "output": clipped,
            "error": f"Execution timed out after {timeout:.0f}s - check for an infinite loop.",
            "truncated": truncated,
            "duration_ms": int((time.perf_counter() - started) * 1000),
        }

    duration_ms = int((time.perf_counter() - started) * 1000)

    if proc.returncode == 0:
        clipped, truncated = _clip(proc.stdout or "")
        return {
            "ok": True,
            "output": clipped,
            "error": "",
            "truncated": truncated,
            "duration_ms": duration_ms,
        }

    # non-zero exit: stdout holds whatever printed before the crash,
    # stderr holds the traceback
    out_clipped, out_trunc = _clip(proc.stdout or "")
    err = (proc.stderr or "").strip() or f"Process exited with code {proc.returncode}"
    return {
        "ok": False,
        "output": out_clipped,
        "error": err,
        "truncated": out_trunc,
        "duration_ms": duration_ms,
    }
