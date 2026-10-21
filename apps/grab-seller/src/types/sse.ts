import { SseFrame } from "@khinemyaezin/seller-api";
import { PlatformEvents } from "@khinemyaezin/seller-contracts";

export interface SseHandler {
  handle(frame: SseFrame, events: PlatformEvents): boolean;
}