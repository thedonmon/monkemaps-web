import { Asset } from "../types/helius";

export type NftData = {
  mint: string;
  name: string;
  updateAuthority: string;
  data: {
    creators: any[];
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
  };
  key: MetadataKey;
  primarySaleHappened: boolean;
  isMutable: boolean;
  editionNonce: number;
  masterEdition?: string;
  edition?: string;
  imageUri?: string;
  nftNumber?: string;
  collection?: string;
};

export enum MetadataKey {
  Uninitialized = 0,
  MetadataV1 = 4,
  EditionV1 = 1,
  MasterEditionV1 = 2,
  MasterEditionV2 = 6,
  EditionMarker = 7,
}

export interface MetaData {
  name?: string;
  symbol?: string;
  description?: string;
  sellerFeeBasisPoints?: number;
  image?: string;
  externalURL?: string;
  collection?: Collection;
  attributes?: Attribute[];
  properties?: Properties;
}

export interface Attribute {
  traitType?: string;
  value?: number | string;
}

export interface Collection {
  name?: string;
  family?: string;
}

export interface Properties {
  files?: File[];
  category?: string;
  creators?: Creator[];
}

export interface Creator {
  address?: string;
  verified?: boolean;
  share?: number;
}

export interface File {
  uri?: string;
  type?: string;
  cdn?: boolean;
}


export function mapAssetToNftData(asset: Asset): NftData {
  const imageFile = asset.content?.files?.find(
    (file) => file.mime?.includes('image/')
  );
  return {
    mint: asset.id || '',
    updateAuthority: '',
    data: {
      creators: asset.creators || [],
      name: asset.content?.metadata?.name || '',
      symbol: asset.content?.metadata?.symbol || '',
      uri: asset.content?.json_uri || '',
      sellerFeeBasisPoints: 0,
    },
    key: MetadataKey.MetadataV1,
    primarySaleHappened: asset.royalty?.primary_sale_happened || false,
    isMutable: asset.mutable || false,
    editionNonce: 0,
    masterEdition: '',
    edition: '',
    imageUri: imageFile ? imageFile.uri : '',
    nftNumber: '',
    name: asset.content?.metadata?.name || '',
    collection: asset.grouping?.find((group) => group.group_key === 'collection')?.group_value || '',
  };
}