import axios, {AxiosResponse} from "axios";
import {SWRConfiguration} from "swr";
export const swrConfig:SWRConfiguration = {
    revalidateOnFocus:false,
    shouldRetryOnError:false
}

export const fetcher = async (url: string) => {
    const res = await axios.get(url)
    return res.data;
}

export async function catchResponse<T>(req: ()=>Promise<AxiosResponse<T,any>> ) {
    try {
        const res  =await req()
        return {data:res.data}
    } catch (err: any) {
        return {error: decodeError(err), errorDetail: err.response?.data}
    }
}

export function decodeError(error: any) {
    if (!error){
        return null
    }
    return  error.response?.data?.title ?? 'An error has occurred. Please try again.';
}