export interface ActitoAsset {
  readonly title: string;
  readonly description?: string;
  readonly key?: string;
  readonly url?: string;
  readonly button?: ActitoAssetButton;
  readonly metaData?: ActitoAssetMetaData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly extra: Record<string, any>;
}

export interface ActitoAssetButton {
  readonly label?: string;
  readonly action?: string;
}

export interface ActitoAssetMetaData {
  readonly originalFileName: string;
  readonly contentType: string;
  readonly contentLength: number;
}
