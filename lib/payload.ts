// Синглтон Payload Local API для серверных компонентов (блог и пр.).
// В dev держим инстанс на globalThis, чтобы HMR не переинициализировал Payload.

import config from "@payload-config";
import { getPayload, type Payload } from "payload";

const globalForPayload = globalThis as unknown as {
  payload?: Promise<Payload>;
};

export function getPayloadClient(): Promise<Payload> {
  if (!globalForPayload.payload) {
    globalForPayload.payload = getPayload({ config });
  }
  return globalForPayload.payload;
}
