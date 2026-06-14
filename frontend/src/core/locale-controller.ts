// Lit ReactiveController: re-rendert die Host-Komponente bei Sprachwechsel.
//
// Nutzung in jeder Komponente, die `t()` im Render verwendet:
//   private _locale = new LocaleController(this);
//
// Damit greift Live-Switching (Sprach-Selector im Header) ohne Page-Reload.

import type { ReactiveController, ReactiveControllerHost } from "lit";
import { subscribeLocale } from "./i18n";

export class LocaleController implements ReactiveController {
  private _host: ReactiveControllerHost;
  private _unsub?: () => void;

  constructor(host: ReactiveControllerHost) {
    this._host = host;
    host.addController(this);
  }

  hostConnected(): void {
    this._unsub = subscribeLocale(() => this._host.requestUpdate());
  }

  hostDisconnected(): void {
    this._unsub?.();
    this._unsub = undefined;
  }
}
