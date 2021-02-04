import {
  FormControl,
  FormLabel,
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Textarea,
  Flex,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import WithNavBar from "../components/WithNavBar";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";
interface IPost {
  title: string;
  text: string;
}
const CreatePost: React.FC = () => {
  const router = useRouter();
  const [error, setError] = React.useState("");
  const [, createPost] = useCreatePostMutation();
  useIsAuth();
  return (
    <WithNavBar pageTitle="Compose" height="100vh">
      <Flex
        flexDirection="column"
        padding="5em"
        justifyContent="center"
        alignItems="center">
        <Formik
          initialValues={{ title: "", text: "" }}
          validate={(values: IPost) => {
            values.title.length === 0 || values.text.length === 0
              ? false
              : true;
          }}
          onSubmit={async (values) => {
            const response = await createPost(values);
            if(response.error?.message){
              setError(response.error?.message);
              return;
            }
            router.push("/");
          }}>
          {({ values, handleChange, isSubmitting }) => (
            <Form>
              <FormControl width="80vw" maxWidth="1100px">
                <FormLabel fontWeight="bold" htmlFor="username" fontSize="170%">
                  Title
                </FormLabel>
                <Input
                  fontSize="130%"
                  required
                  border="2px solid whitesmoke"
                  value={values.title}
                  onChange={handleChange}
                  type="text"
                  id="title"
                  placeholder="Content Header..."
                  style={{ marginBottom: "15px" }}
                />

                <FormLabel fontSize="170%" fontWeight="bold" htmlFor="username">
                  Content
                </FormLabel>
                <Textarea
                  required
                  rows={12}
                  border="2px solid whitesmoke"
                  value={values.text}
                  onChange={handleChange}
                  type="text"
                  id="text"
                  placeholder="Your thoughts..."
                  style={{ marginBottom: "15px" }}
                />
                {error.length !== 0 && (
                  <Alert status="error">
                    <AlertIcon />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}
                <br />
                <Flex justifyContent="space-between">
                  {" "}
                  <Button
                    marginRight="10px"
                    colorScheme="red"
                    aria-label="cancel"
                    onClick={() => router.back()}>
                    Exit
                  </Button>
                  <Button
                    marginRight="10px"
                    aria-label="Create"
                    colorScheme="green"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    type="submit">
                    Create
                  </Button>
                </Flex>
              </FormControl>
            </Form>
          )}
        </Formik>
      </Flex>
    </WithNavBar>
  );
};
export default withUrqlClient(createUrqlClient)(CreatePost);
