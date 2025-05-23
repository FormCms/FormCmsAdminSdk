import useSWR from "swr";
import { fullCmsApiUrl } from "../configs";
import {catchResponse, decodeError, fetcher, swrConfig } from "../../utils/apiUtils";
import axios from "axios";
import { Asset } from "../types/asset";
import {XEntity} from "../../types/xEntity";
import {ListResponse} from "../../types/listResponse";

export function useSingleAsset(id: any){
    let res = useSWR<Asset>(fullCmsApiUrl(`/assets/${id}`), fetcher,swrConfig);
    return {...res, error:decodeError(res.error)}
}

export function useSingleAssetByPath(path: any){
    let url = path ? fullCmsApiUrl(`/assets/path?path=${path}`):null;
    let res = useSWR<Asset>(url, fetcher,swrConfig);
    return {...res, error:decodeError(res.error)}
}
export  function useAssetEntityWithLink() {
    let res = useSWR<XEntity>(fullCmsApiUrl(`/assets/entity?linkCount=${true}`), fetcher,swrConfig);
    return {...res, error:decodeError(res.error)}
}

export  function useAssetEntity() {
    let res = useSWR<XEntity>(fullCmsApiUrl(`/assets/entity?linkCount=${false}`), fetcher,swrConfig);
    return {...res, error:decodeError(res.error)}
}
export  function useAssets(qs:string,withLinkCount:boolean) {
    let res = useSWR<ListResponse>(fullCmsApiUrl(`/assets?linkCount=${withLinkCount}&${qs}`), fetcher,swrConfig);
    return {...res, error:decodeError(res.error)}
}

export function getAssetReplaceUrl(id:number){
    return  fullCmsApiUrl(`/assets/${id}`);
}

export function getFileUploadURL (){
    return  fullCmsApiUrl('/assets');
}

export function useGetCmsAssetsUrl (){
    const { data: assetBaseUrl } = useSWR<string>(fullCmsApiUrl(`/assets/base`), fetcher, swrConfig);
    return (url: string) => {
        if (!url) return url;
        return url.startsWith('http') ? url : `${assetBaseUrl || ''}${url}`;
    }
}

export function deleteAsset (id:number) {
    return catchResponse(()=>axios.post(fullCmsApiUrl(`/assets/delete/${id}/`)))
}

export function updateAssetMeta (asset:any) {
    return catchResponse(()=>axios.post(fullCmsApiUrl(`/assets/meta/`),asset))
}