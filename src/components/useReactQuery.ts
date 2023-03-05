import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";

import {
  fetchRepositories,
  NUMBER_OF_REPOSITORIES_PER_PAGE,
} from "../api/repositoriesApi";

const queryOptions = {
  staleTime: 10000,
  keepPreviousData: true,
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
};

const useReactQuery = (searchQuery: string) => {
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery(
    ["repositories", searchQuery, currentPage],
    () => fetchRepositories(searchQuery, currentPage),
    {
      ...queryOptions,
      enabled: !!searchQuery,
    }
  );

  const repositories = data?.items || [];
  const totalCount = data?.total_count || 0;

  useEffect(() => {
    if (
      searchQuery &&
      currentPage < totalCount / NUMBER_OF_REPOSITORIES_PER_PAGE
    ) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(
        ["repositories", searchQuery, nextPage],
        () => fetchRepositories(searchQuery, nextPage),
        queryOptions
      );
    }
  }, [currentPage, queryClient, searchQuery, totalCount]);

  return {
    repositories,
    hasError: data !== undefined && data.hasOwnProperty("message"),
    isLoading,
    totalCount,
    currentPage,
    setCurrentPage,
  };
};

export default useReactQuery;
