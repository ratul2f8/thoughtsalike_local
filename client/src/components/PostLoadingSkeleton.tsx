import {
  Box,
  SkeletonCircle,
  SkeletonText,
  useColorMode,
} from "@chakra-ui/react";
import React from "react";
const PostLoaderSkeleton = () => {
  const { colorMode } = useColorMode();

  const bgColor = { light: "gray.50", dark: "gray.900" };

  const color = { light: "black", dark: "white" };
  return (
    <Box
      padding="6"
      boxShadow="lg"
      height="90%"
      width="80%"
      bg={bgColor[colorMode]}
      color={color[colorMode]}>
      <SkeletonCircle size="10" />
      <SkeletonText mt="4" noOfLines={15} spacing="4"
      />
    </Box>
  );
};
export default PostLoaderSkeleton;
