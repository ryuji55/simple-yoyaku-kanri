import { useSearchParams } from 'next/navigation'

export const useQueryParams = () => {
  const searchParams = useSearchParams()
  
  const getParam = (key: string): string | null => {
    return searchParams.get(key)
  }

  return {
    getParam,
    storeCode: getParam('store'),
  }
}