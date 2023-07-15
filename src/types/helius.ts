export interface SortBy {
    sortBy?: string;
    sortDirection?: string;
}

export interface Params {
    page: number;
    authorityAddress?: string;
    limit: number;
    sortBy?: SortBy;
    compressed?: boolean;
    compressible?: boolean;
    delegate?: number;
    creatorAddress?: string;
    creatorVerified?: boolean;
    grouping?: string[];
    supply?: number;
    supplyMint?: string;
    frozen?: boolean;
    burnt?: boolean;
    interface?: string;
    ownerAddress?: string;
    royaltyTargetType?: string;
    royaltyTarget?: null;
    royaltyAmount?: number;
    ownerType?: string;
    before?: string;
    after?: string;
}

export interface SearchAssetRequest {
    jsonrpc: string;
    id: string;
    method: 'searchAssets';
    params: Params;
}


export interface SortBy {
    sortBy?: string;
    sortDirection?: string;
}

export interface Params {
    page: number;
    authorityAddress?: string;
    limit: number;
    sortBy?: SortBy;
    compressed?: boolean;
    compressible?: boolean;
    delegate?: number;
    creatorAddress?: string;
    creatorVerified?: boolean;
    grouping?: string[];
    supply?: number;
    supplyMint?: string;
    frozen?: boolean;
    burnt?: boolean;
    interface?: string;
    ownerAddress?: string;
    royaltyTargetType?: string;
    royaltyTarget?: null;
    royaltyAmount?: number;
    ownerType?: string;
    before?: string;
    after?: string;
}

export interface SearchAssetRequest {
    jsonrpc: string;
    id: string;
    method: 'searchAssets';
    params: Params;
}

export interface Attribute {
    value?: number | string;
    trait_type?: string;
  }
  
  export interface File {
    uri?: string;
    cdn_uri?: string;
    mime?: string;
  }
  
  export interface Metadata {
    attributes?: Attribute[];
    description?: string;
    name?: string;
    symbol?: string;
  }
  
  export interface Links {
    image?: string;
    external_url?: string;
  }
  
  export interface Creator {
    address?: string;
    share?: number;
    verified?: boolean;
  }
  
  export interface Asset {
    interface?: string;
    id?: string;
    content?: {
      $schema?: string;
      json_uri?: string;
      files?: File[];
      metadata?: Metadata;
    };
    authorities?: {
      address?: string;
      scopes?: string[];
    }[];
    compression?: {
      eligible?: boolean;
      compressed?: boolean;
      data_hash?: string;
      creator_hash?: string;
      asset_hash?: string;
      tree?: string;
      seq?: number;
      leaf_id?: number;
    };
    grouping?: {
      group_key?: string;
      group_value?: string;
    }[];
    royalty?: {
      royalty_model?: string;
      target?: null | any;
      percent?: number;
      basis_points?: number;
      primary_sale_happened?: boolean;
      locked?: boolean;
    };
    creators?: Creator[];
    ownership?: {
      frozen?: boolean;
      delegated?: boolean;
      delegate?: null | any;
      ownership_model?: string;
      owner?: string;
    };
    supply?: null | any;
    mutable?: boolean;
    burnt?: boolean;
  }
  

export interface AssetsResponse {
    result: {
        total: number;
        limit: number;
        page: number;
        items: Asset[];
    };
}


export interface AssetsResponse {
    result: {
        total: number;
        limit: number;
        page: number;
        items: Asset[];
    };
}
