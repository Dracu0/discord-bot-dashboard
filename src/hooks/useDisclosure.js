import { useState, useCallback } from 'react';

export function useDisclosure(initial = false) {
  const [opened, setOpened] = useState(initial);
  const open = useCallback(() => setOpened(true), []);
  const close = useCallback(() => setOpened(false), []);
  const toggle = useCallback(() => setOpened(p => !p), []);
  return [opened, { open, close, toggle }];
}
