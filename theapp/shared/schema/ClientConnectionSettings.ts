import {literal, string, strictObject} from 'zod';
import type {infer as zodInfer} from 'zod';

const qBittorrentConnectionSettingsSchema = strictObject({
  client: literal('qBittorrent'),
  type: literal('web'),
  version: literal(1),
  url: string().url(),
  username: string(),
  password: string(),
});

export type QBittorrentConnectionSettings = zodInfer<typeof qBittorrentConnectionSettingsSchema>;

export type ClientConnectionSettings = zodInfer<typeof qBittorrentConnectionSettingsSchema>;
