import React, { useState } from "react";
import  Container  from "../components/Container";
import { Form, Formik } from "formik";
import {
  Alert,
  //AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Link,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useLoginMutation } from "../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import  ChangePasswordModal from "../components/ForgotPasswordModal";
interface Ilogin {
  identifier: string;
  password: string;
}
// interface IError {
//   username?: string;
//   password?: string;
//   email?: string
// }
// const ErrorLog: React.FC<{ message: string }> = ({ message }) => {
//   return (
//     <Alert
//       status="error"
//       style={{
//         fontSize: "80%",
//         color: "#990033",
//       }}
//       variant="outlined">
//       <AlertIcon />
//       <AlertDescription mr={2}>{message}</AlertDescription>
//     </Alert>
//   );
// };
const LoginPage: React.FC<Ilogin> = () => {
  //**************ACTUAL LOGIN PROCESSS******** */
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [, login] = useLoginMutation();
  const [responseErrors, setResponseErrors] = useState<{
    field: string;
    message: string;
  }>({ field: "", message: "" });
  const router = useRouter();
  return (
    <Container height="100vh" pageTitle="Login" backButton={true}>
      {modalOpen && <ChangePasswordModal open={modalOpen} />}
      <Box
        style={{
          width: "80vw",
          maxWidth: "600px",
          transform: "translateY(50%)",
        }}>
        <Formik
          initialValues={{ identifier: "", password: "" }}
          onSubmit={async (values) => {
            const response = await login(values);
            if (response.data?.login.errors) {
              const { field, message } = response.data?.login.errors[0];
              setResponseErrors({
                field,
                message,
              });
            }
            if (response.data?.login.user) {
              console.log(response.data?.login.user);
              router.back();
              return null;
            }
          }}>
          {({ values, handleChange, isSubmitting }) => (
            <Form>
              <FormControl>
                <FormLabel fontWeight="bold" htmlFor="identifier">
                  Username or Email
                </FormLabel>
                <Input
                  required
                  border="2px solid whitesmoke"
                  value={values.identifier}
                  onChange={handleChange}
                  type="text"
                  id="identifier"
                  isInvalid={
                    responseErrors.field === "username" ||
                    responseErrors.field === "email"
                  }
                  placeholder="Username or Email"
                />
                <br />
                <br />
                <FormLabel fontWeight="bold" htmlFor="password">
                  Password
                </FormLabel>
                <Input
                  required
                  border="2px solid whitesmoke"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  id="password"
                  placeholder="password"
                  isInvalid={responseErrors.field === "password"}
                />
              </FormControl>
              <br />
              {responseErrors.message.length !== 0 &&
              responseErrors.field.length !== 0 ? (
                <Alert status="error" mb="1em" borderRadius="5px">
                  <AlertIcon />
                  <AlertTitle>{responseErrors.message}</AlertTitle>
                </Alert>
              ) : null}
              <Button
                colorScheme="green"
                isLoading={isSubmitting}
                type="submit"
                mb="10px">
                Login
              </Button>
            </Form>
          )}
        </Formik>
        <Link onClick={() => setModalOpen(!modalOpen)}>Forgot password</Link>
      </Box>
    </Container>
  );
};

export default withUrqlClient(createUrqlClient)(LoginPage);
