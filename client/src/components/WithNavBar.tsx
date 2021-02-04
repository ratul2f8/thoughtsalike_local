import React from "react";
import {
  Flex,
  Heading,
  useColorMode,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  EditIcon,
  QuestionOutlineIcon,
} from "@chakra-ui/icons";
import Link from "next/link";
import { DarkModeSwitch } from "./DarkModeSwitch";
import NProgress from "nprogress";
import Router from "next/router";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { ProgressPage } from "./ProgressPage";
import { isServer } from "../utils/isServer";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
NProgress.configure({
  showSpinner: false,
});
Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeError = () => NProgress.done();
Router.onRouteChangeComplete = () => NProgress.done();

interface IContainer {
  height?: string;
  children?: React.ReactNode;
  pageTitle?: string;
}

const WithNavBar: React.FC<IContainer> = ({
  children,
  pageTitle,
  ...otherProps
}) => {
  const { colorMode } = useColorMode();

  const [{ fetching: loggingOut }, logout] = useLogoutMutation();

  const bgColor = { light: "gray.50", dark: "gray.900" };

  const color = { light: "black", dark: "white" };

  const [{ data, fetching: querying }] = useMeQuery({
    pause: isServer(),
  });
  let body = null;
  if (querying) {
    body = <ProgressPage />;
  } else if (!data?.me) {
    body = (
      <Flex
        id="begin"
        direction="column"
        alignItems="center"
        position="relative"
        justifyContent="flex-start"
        bg={bgColor[colorMode]}
        color={color[colorMode]}
        overflowX="hidden"
        overflowY="scroll"
        {...otherProps}>
        <Flex
          width="100vw"
          height="8vh"
          maxHeight="70px"
          flexDirection="row"
          position="fixed"
          top="0"
          left="0"
          bg={bgColor[colorMode]}
          color={color[colorMode]}
          zIndex={1000}
          paddingTop="0.5em"
          paddingLeft="0.7em"
          paddingBottom="0.5em">
          <div style={{ cursor: "pointer" }} onClick={() => Router.push("/")}>
            <Heading>{pageTitle}</Heading>
          </div>
          <Box marginLeft="auto" marginRight="0.9em">
            <Link href="/login">
              <Button colorScheme="green" width="8vw" minWidth="60px">
                Login
              </Button>
            </Link>
          </Box>
          <Box marginRight="0.9em">
            <Link href="/register">
              <Button colorScheme="blue" width="8vw" minWidth="80px">
                Register
              </Button>
            </Link>
          </Box>
          <Box marginRight="0.9em">
            <DarkModeSwitch />
          </Box>
        </Flex>

        <Flex flexDirection="column">
          <Box
            width="100vw"
            height="8vh"
            maxHeight="70px"
            bg={bgColor[colorMode]}
            color={color[colorMode]}
          />
          <Box>{children}</Box>
        </Flex>
      </Flex>
    );
  } else {
    body = (
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="flex-start"
        position="relative"
        bg={bgColor[colorMode]}
        color={color[colorMode]}
        overflowX="hidden"
        overflowY="scroll"
        {...otherProps}>
        <Flex
          width="100vw"
          height="8vh"
          maxHeight="70px"
          flexDirection="row"
          position="fixed"
          top="0"
          left="0"
          bg={bgColor[colorMode]}
          color={color[colorMode]}
          zIndex={1000}
          paddingTop="0.5em"
          paddingLeft="0.7em"
          paddingBottom="0.5em">
          <div style={{ cursor: "pointer" }} onClick={() => Router.push("/")}>
            <Heading>{pageTitle}</Heading>
          </div>

          <Box marginLeft="auto" marginRight="0.9em">
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                {data?.me.username}
              </MenuButton>
              <MenuList border="3px solid whitesmoke">
                <MenuItem
                  justifyContent="center"
                  alignItems="center"
                  onClick={() => Router.push(`/profile/${data?.me?.id}`)}
                  fontWeight="bold">
                  <Text fontWeight="bold">Profile</Text>
                </MenuItem>

                <MenuItem
                  justifyContent="center"
                  alignItems="center"
                  disabled={loggingOut}
                  onClick={() => logout()}>
                  <Text fontWeight="bold">Logout</Text>
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
          <Box marginRight="0.9em">
            <DarkModeSwitch />
          </Box>
        </Flex>
        <Flex flexDirection="column">
          <Box
            width="100vw"
            height="8vh"
            maxHeight="70px"
            bg={bgColor[colorMode]}
            color={color[colorMode]}
          />
          <Box>{children}</Box>
        </Flex>

        {Router.pathname !== "/create-post" && (
          <Tooltip hasArrow label="Create Post" placement="left">
            {/* <IconButton
              position="fixed"
              bottom="5%"
              right="2%"
              colorScheme="green"
              borderRadius="50%"
              aria-label="create"
              zIndex="1000"
              padding="0.5em"
              height="56px"
              width="56px"
              onClick={() => Router.push("/create-post")}
              boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
              icon={<EditIcon fontSize="100%" />}
            /> */}
            <Button
              position="fixed"
              bottom="5%"
              right="2%"
              colorScheme="pink"
              onClick={() => Router.push("/create-post")}
              boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
              rightIcon={<EditIcon />}>
              Compose
            </Button>
          </Tooltip>
        )}
      </Flex>
    );
  }
  return <>{body}</>;
};
export default withUrqlClient(createUrqlClient)(WithNavBar);
