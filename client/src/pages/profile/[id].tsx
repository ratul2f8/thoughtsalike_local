import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorMode,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import React from "react";
import ComposedPosts from "../../components/ComposedPosts";
import Container from "../../components/Container";
import DislikedPosts from "../../components/DislikedPosts";
import Info from "../../components/Info";
import LikedPost from "../../components/LikedPost";
import { createUrqlClient } from "../../utils/createUrqlClient";
const ProfileView: NextPage<{ id: number }> = ({ id }) => {
  const { colorMode } = useColorMode();

  const bgColor = { light: "gray.50", dark: "#17202A" };

  const color = { light: "black", dark: "white" };
  return (
    <Container backButton={true} pageTitle="Profile" >
      <Tabs variant="soft-rounded" colorScheme="green" width="100%" height="auto"
        paddingTop="20px"
        paddingLeft="20px"
        paddingRight="20px"
        paddingBottom="20px"
        justifyContent="center"
        bg={bgColor[colorMode]}
        color={color[colorMode]}
        >
          <TabList>
            <Tab>About</Tab>
            <Tab>Composed</Tab>
            <Tab>Liked</Tab>
            <Tab>Disiked</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Info id={id} />
            </TabPanel>
            <TabPanel height="100%" width="100%">
              <ComposedPosts id={id}/>
            </TabPanel>
            <TabPanel height="100%" width="100%">
              <LikedPost id={id} />
            </TabPanel>
            <TabPanel height="100%" width="100%">
              <DislikedPosts id={id}/>
            </TabPanel>
          </TabPanels>
        </Tabs>
    </Container>
  );
};
ProfileView.getInitialProps = ({ query }) => {
  return {
    id: +query.id,
  };
};
export default withUrqlClient(createUrqlClient)(ProfileView);
