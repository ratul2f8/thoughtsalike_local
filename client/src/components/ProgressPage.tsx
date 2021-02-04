import { Spinner, Flex } from "@chakra-ui/react";
import React from "react";
export const ProgressPage = () => (
  <Flex
    height="100vh"
    width="100vw"
    textAlign="center"
    justifyContent="center"
    alignItems="center">
    <Spinner
      thickness="5px"
      speed="0.85s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
    />
  </Flex>
);
