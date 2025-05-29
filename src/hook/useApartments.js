import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';

export const useApartments = (page = 1, searchParams = {}) => {
  return useQuery({
    queryKey: ['apartments', page, searchParams],
    queryFn: async () => {
      const response = await axiosInstance.get('/apartments', {
        params: { page, ...searchParams }
      });
      return response.data;
    },
    keepPreviousData: true,
  });
};