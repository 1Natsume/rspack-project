// hooks/useWebScraper.ts
import { useState, useCallback } from 'react';
import { webScraper, ScrapingConfig, ScrapingResult } from '../utils/webScraper';

interface UseWebScraperReturn {
  data: string | null;
  loading: boolean;
  error: string | null;
  scrape: (config: ScrapingConfig) => Promise<void>;
  reset: () => void;
}

// export const useWebScraper = (): UseWebScraperReturn => {
//   const [data, setData] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const scrape = useCallback(async (config: ScrapingConfig) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const result: ScrapingResult = await webScraper.scrapeElement(config);
      
//       if (result.success) {
//         setData(result.data);
//       } else {
//         setError(result.error || '获取数据失败');
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : '未知错误');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const reset = useCallback(() => {
//     setData(null);
//     setError(null);
//     setLoading(false);
//   }, []);

//   return {
//     data,
//     loading,
//     error,
//     scrape,
//     reset,
//   };
// };