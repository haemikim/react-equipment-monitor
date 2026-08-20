import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { queryClient } from "./QueryClient";

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
      <Toaster />
    </QueryClientProvider>
  );
}
