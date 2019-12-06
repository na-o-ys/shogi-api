import { Box, BoxProps } from "@chakra-ui/core";
import React from "react";

export const Table = (props: BoxProps) => (
  <Box as="table" textAlign="left" width="full" {...props} />
);

export const THead = (props: BoxProps) => {
  return (
    <Box
      as="th"
      bg="gray.50"
      fontWeight="semibold"
      p={2}
      fontSize="sm"
      {...props}
    />
  );
};

export const TData = (props: BoxProps) => (
  <Box
    as="td"
    p={2}
    borderTopWidth="1px"
    borderColor="inherit"
    fontSize="sm"
    whiteSpace="normal"
    {...props}
  />
);
