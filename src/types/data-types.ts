export interface ArchiveItem {
  id: string;
  entity_uuid: string;
  tenant: string;
  title: string;
  description: string;
  asset: Asset[];
  pdf: unknown[];
  metadata: Metadaum[];
  geodata: unknown[];
  webexpositions: unknown;
  links: Links;
  watermark: boolean;
  iprestricted: boolean;
  handle: string;
  year: number | string;
}

export interface Asset {
  uuid: string;
  mimetype: string;
  fullname: string;
  available_mimetypes: string[];
  dc_title: string;
  default_thumb: boolean;
  filename: string;
  dc_subject: any;
  width: number;
  height: number;
  rank: number;
  isgeotiff: any;
  mapdata: unknown;
  mediatype: string;
  topview: string;
  deepzoom: string;
  thumb: Thumb;
  download: string;
  downloadList: boolean;
}

export interface Thumb {
  small: string;
  medium: string;
  fluid: string;
  large: string;
  vertical: string;
}

export interface Metadaum {
  field: string;
  label: string;
  value: string | Metadaum[] | null;
}

export interface Links {
  media: string;
}
