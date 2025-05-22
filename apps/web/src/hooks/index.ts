import { API_URL } from '@/lib/env';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Mutations

type OrderReq = {
   market: string;
   price: string;
   quantity: string;
   side: string;
   userId: string;
};

export function useExecuteOrder(market: string) {
   const queryClient = useQueryClient();
   const mutation = useMutation<ResponseType, Error, OrderReq>({
      mutationFn: async (data) => {
         const response = await fetch(`${API_URL}/order`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               accept: '*/*'
            },
            body: JSON.stringify(data)
         });

         if (!response.ok) {
            throw new Error('Failed to execute order');
         }

         return await response.json();
      },
      onSuccess: () => {
         toast.success('Order created successfully', { duration: 1300 });
         queryClient.invalidateQueries({ queryKey: ['UserBalance'] });
         queryClient.invalidateQueries({ queryKey: [market] });
      },
      onError: (error) => {
         toast.error(error.message || 'Failed to create order', {
            duration: 1300
         });
      }
   });
   return mutation;
}

type DepositReq = {
   asset: string;
   quantity: string;
   userId: string;
};

export function useDepositAsset() {
   const queryClient = useQueryClient();
   const mutation = useMutation<ResponseType, Error, DepositReq>({
      mutationFn: async (data) => {
         const response = await fetch(`${API_URL}/order/on-ramp`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               accept: '*/*'
            },
            body: JSON.stringify(data)
         });
         if (!response.ok) {
            throw new Error('Failed to deposit asset');
         }

         return await response.json();
      },
      onSuccess: () => {
         toast.success('Asset added successfully', { duration: 1300 });
         queryClient.invalidateQueries({ queryKey: ['UserBalance'] });
      },
      onError: (error) => {
         toast.error(error.message || 'Failed to deposit asset', {
            duration: 1300
         });
      }
   });
   return mutation;
}

// Query

type userBalRes = {
   [key: string]: {
      available: number;
      locked: number;
   };
};

export function useGetUserBalances() {
   return useQuery<userBalRes>({
      queryKey: ['UserBalance'],
      queryFn: async () => {
         const response = await fetch(`${API_URL}/capital`);
         if (!response.ok) {
            throw new Error('Failed to fetch user balances');
         }

         const data = await response.json();
         return data;
      },
      retry: 2,
      refetchOnWindowFocus: true,
      staleTime: 30000 // Consider data fresh for 30 seconds
      // initialData: {} as userBalRes, // Provide empty initial data
   });
}

export function useGetUserOpenOrders(market: string) {
   return useQuery<
      {
         id: string;
         price: string;
         quantity: string;
         side: string;
      }[]
   >({
      queryKey: [market],
      queryFn: async () => {
         const response = await fetch(
            `${API_URL}/order/open?symbol=${market}&userId=47854`
         );
         if (!response.ok) {
            throw new Error('Failed to fetch user balances');
         }

         const data = await response.json();
         return data;
      },
      retry: 2,
      refetchOnWindowFocus: true,
      staleTime: 30000
   });
}
