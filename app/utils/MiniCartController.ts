let externalTriggerFn: (() => void) | null = null;

export function registerMiniCartTrigger(fn: () => void) {
  externalTriggerFn = fn;
}

export function showMiniCart() {
  if (externalTriggerFn) {
    externalTriggerFn();
  }
}
