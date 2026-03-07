import { useEffect, useRef } from 'react';

/**
 * Register keyboard shortcuts. Compatible with the Mantine useHotkeys API.
 * @param {Array<[string, function]>} hotkeys - Array of [combo, callback] pairs.
 *   combo format: "mod+key" or "mod+shift+key" where mod = Ctrl (or Cmd on Mac).
 */
export function useHotkeys(hotkeys) {
  const hotkeysRef = useRef(hotkeys);
  hotkeysRef.current = hotkeys;

  useEffect(() => {
    const handler = (e) => {
      for (const [combo, callback] of hotkeysRef.current) {
        const parts = combo.toLowerCase().split('+');
        const needsMod = parts.includes('mod');
        const needsShift = parts.includes('shift');
        const key = parts.filter(p => p !== 'mod' && p !== 'shift')[0];

        if (!key) continue;

        const hasMod = needsMod ? (e.metaKey || e.ctrlKey) : !(e.metaKey || e.ctrlKey);
        const hasShift = needsShift ? e.shiftKey : !e.shiftKey;
        const keyMatches = e.key.toLowerCase() === key;

        if (hasMod && hasShift && keyMatches) {
          e.preventDefault();
          callback(e);
          return;
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}
