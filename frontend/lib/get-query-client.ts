import { QueryClient, defaultShouldDehydrateQuery } from "@tanstack/react-query";
import { cache } from "react";

export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          retry: 1,
        },
        dehydrate: {
          // Include pending queries so streaming works:
          // server kicks off prefetch without await → dehydrates the
          // pending promise → client suspends until the stream resolves.
          shouldDehydrateQuery: (query) =>
            defaultShouldDehydrateQuery(query) ||
            query.state.status === "pending",
        },
      },
    })
);
