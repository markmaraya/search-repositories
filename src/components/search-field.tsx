import { ChangeEvent, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import useReactQuery from "./useReactQuery";
import useThrottle from "./useThrottle";

import { Repository } from "Repository-Type";

const SearchField = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const throttleSearchQuery = useThrottle(searchQuery);
  const {
    repositories,
    totalCount,
    isLoading,
    hasError,
    currentPage,
    setCurrentPage,
  } = useReactQuery(throttleSearchQuery);

  const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const onPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scroll({ top: 0, behavior: "smooth" });
  };

  return (
    <Box height="calc(100vh - 2em)" display="flex" flexDirection="column">
      <Box>
        <FormControl>
          <TextField
            id="search"
            label="Search Github Repository"
            variant="outlined"
            sx={{
              width: "500px",
              marginY: "1em",
            }}
            placeholder="Github Repository Name"
            onChange={onSearch}
          />
        </FormControl>
      </Box>
      <Box flex={1} overflow="auto">
        {isLoading && <CircularProgress color="primary" />}
        {!hasError && totalCount === 0 && searchQuery && (
          <Typography variant="h6">
            We couldn’t find any repositories matching '{searchQuery}'
          </Typography>
        )}
        {hasError && (
          <Typography variant="h6">
            API rate limit exceeded. Please wait for some time to be continue to
            search
          </Typography>
        )}
        {totalCount > 0 && (
          <Stack>
            {repositories.map((item: Repository) => (
              <Card
                key={item.id}
                sx={{ minWidth: 275, marginY: "0.5em", marginRight: "0.5em" }}
              >
                <CardContent>
                  <Typography
                    sx={{ fontSize: 16, fontWeight: 700 }}
                    color="primary"
                    gutterBottom
                  >
                    {item.full_name}
                  </Typography>
                  <Typography component="span" sx={{ fontSize: 14 }}>
                    {item.description}
                  </Typography>
                  <Box sx={{ display: "flex" }} mt={1}>
                    <Typography variant="body2" sx={{ display: "flex" }} mr={4}>
                      <StarBorderIcon
                        style={{ fontSize: "1.2rem", marginRight: "0.2rem" }}
                      />
                      {item.stargazers_count}
                    </Typography>
                    <Typography variant="body2" sx={{ display: "flex" }}>
                      <CircleOutlinedIcon
                        style={{ fontSize: "1.1rem", marginRight: "0.2rem" }}
                      />
                      {item.language}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
      <Box pt={2} display="flex" justifyContent={"space-between"}>
        <Pagination count={10} page={currentPage} onChange={onPageChange} />
        <Typography pr={2}>Total Repositories: {totalCount}</Typography>
      </Box>
    </Box>
  );
};

export default SearchField;
