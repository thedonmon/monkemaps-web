import axios from "axios";
import { SearchAssetRequest, AssetsResponse, Asset } from "../types/helius";


export const searchAssetsByCollection = async (ownerAddress: string, collection: string): Promise<Asset[]> => {
    const url = process.env.REACT_APP_HELIUS_RPC
    if (!url) throw new Error('REACT_APP_HELIUS_RPC not set');
    const responseAssets: Asset[] = [];
    try {
        const searchAssetsRequest: SearchAssetRequest = {
            jsonrpc: '2.0',
            id: `${ownerAddress}-${collection}`,
            method: 'searchAssets',
            params: {
                ownerAddress: ownerAddress,
                grouping: ["collection", collection],
                page: 1, // Starts at 1
                limit: 1000
            }
        }
        const response = await axios.post<AssetsResponse>(url, searchAssetsRequest, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.data && response.data.result.items) {
            responseAssets.push(...response.data.result.items);
        }
    } catch (e) {
        console.log(e);
    }
    return responseAssets;

};
