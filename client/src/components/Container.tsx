import React from "react";
import { Flex, Heading, useColorMode, IconButton, Box } from "@chakra-ui/react";
import Router from "next/router";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
interface IContainer {
  height?: string;
  children?: React.ReactNode;
  pageTitle?: string;
  backButton: boolean;
}
const Container: React.FC<IContainer> = ({
  children,
  pageTitle,
  backButton,
  ...otherProps
}) => {
  const { colorMode } = useColorMode();

  const bgColor = { light: "gray.50", dark: "gray.900" };

  const color = { light: "black", dark: "white" };
  return (
    <Flex
      direction="column"
      alignItems="center"
      height="100vh"
      width="100vw"
      overflowY="scroll"
      overflowX="hidden"
      justifyContent="flex-start"
      bg={bgColor[colorMode]}
      color={color[colorMode]}
      {...otherProps}>
      <Heading
        textAlign="left"
        width="50vw"
        marginRight="auto"
        paddingTop="0.4em"
        bg={bgColor[colorMode]}
        color={color[colorMode]}
        paddingLeft="0.4em">
        {backButton && (
          <IconButton
            marginRight="0.5em"
            borderRadius="50%"
            aria-label="back"
            onClick={() => Router.back()}
            icon={<ArrowBackIcon />}
          />
        )}
        {pageTitle}
      </Heading>
      <Box position="fixed" top="1em" right="1em" zIndex="5000">
        <DarkModeSwitch />
      </Box>
      <Flex
        height="auto"
        width="100%"
        justifyContent="center"
        alignItems="center"
        bg={bgColor[colorMode]}
        color={color[colorMode]}
        textAlign="center">
        {children}
      </Flex>
    </Flex>
  );
};
export default withUrqlClient(createUrqlClient)(Container);
