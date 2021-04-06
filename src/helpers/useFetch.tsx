import useSWR from 'swr'

export function useFetch<Data = any, Error = any>(url: string, method : string = "GET") {
    const { data, error, mutate } = useSWR<Data>(url, async url => {
        
        const headers = new Headers()
        headers.append("Accept", "application/json")
        headers.append("Content-Type", "application/json")
        // headers.append("Authorization", "Bearer")

        const response = await fetch(url, {method , headers})
        const data = await response.json()
        
        return data
    }, {
        revalidateOnReconnect: true,
    })

    return { data, error, mutate } 
}