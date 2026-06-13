// Minimale HA-Frontend-Typen — nur das, was Studio anfasst.
// Statt eine schwergewichtige Abhängigkeit auf @types/home-assistant zu ziehen,
// deklarieren wir hier nur die Felder, die wir wirklich nutzen.

export interface HassConnection {
  sendMessagePromise<T = unknown>(msg: {
    type: string;
    [key: string]: unknown;
  }): Promise<T>;
}

export interface HomeAssistant {
  connection: HassConnection;
  language: string;
  themes: {
    darkMode: boolean;
    // Globales Default-Theme (HA hat dafür keine eigene UI — nur der
    // frontend.set_theme-Service). Theme-Name, nicht Dateiname.
    default_theme?: string;
    default_dark_theme?: string | null;
  };
}

export interface PanelRoute {
  prefix: string;
  path: string;
}
