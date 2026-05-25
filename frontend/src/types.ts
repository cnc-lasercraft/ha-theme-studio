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
  };
}

export interface PanelRoute {
  prefix: string;
  path: string;
}
