import React, { useState } from "react";
import  Container  from "../components/Container";
import { Form, Formik } from "formik";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useRegisterMutation } from "../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
interface IRegister {
  username: string;
  password: string;
  email: string;
}
interface IError {
  username?: string;
  password?: string;
  email?: string;
}
export function validateEmail(email: string): boolean {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}
const ErrorLog: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Alert
      status="error"
      style={{
        fontSize: "80%",
        color: "#990033",
      }}
      variant="outlined">
      <AlertIcon />
      <AlertDescription mr={2}>{message}</AlertDescription>
    </Alert>
  );
};
const RegisterPage: React.FC<IRegister> = () => {
  const [, register] = useRegisterMutation();
  const [responseErrors, setResponseErrors] = useState<{
    field: string;
    message: string;
  }>({ field: "", message: "" });
  const router = useRouter();
  return (
    <Container height="100vh" pageTitle="Register" backButton={true}>
      <Box
        style={{
          width: "80vw",
          maxWidth: "600px",
          marginTop: "15vh",
          transform: "translateY(10%)"
        }}>
        <Formik
          initialValues={{ username: "", password: "", email: "" }}
          validate={(values: IRegister): IError => {
            const errors: IError = {};
            if (values.username.length <= 2) {
              errors.username = "Length must be greater than 2";
            }
            if (values.password.length <= 2) {
              errors.password = "Length must be greater than 2";
            }
            if(!validateEmail(values.email)) {
              errors.email =  "Invalid email address!"
            }
            return errors;
          }}
          onSubmit={async (values) => {
            const response = await register(values);
            if (response.data?.register.errors) {
              const { field, message } = response.data?.register.errors[0];
              setResponseErrors({
                field,
                message
              })
            }
            if (response.data?.register.user) {
              console.log(response.data?.register.user);
              router.push("/");
              return null;
            }
          }}>
          {({ values, handleChange, isSubmitting, errors }) => (
            <Form>
              <FormControl>
                <FormLabel fontWeight="bold" htmlFor="username">
                  Email
                </FormLabel>
                <Input
                  required
                  border="2px solid whitesmoke"
                  value={values.email}
                  onChange={handleChange}
                  type="email"
                  id="email"
                  isInvalid={responseErrors.field === 'email'}
                  placeholder="Email"
                  style={{marginBottom: !(errors.email && values.email) && "15px"}}
                />
                {errors.email && values.email && (
                  <ErrorLog message={errors.email} />
                )}
               
                <FormLabel fontWeight="bold" htmlFor="username">
                  Username
                </FormLabel>
                <Input
                  required
                  border="2px solid whitesmoke"
                  value={values.username}
                  onChange={handleChange}
                  type="text"
                  id="username"
                  isInvalid={responseErrors.field === 'username'}
                  placeholder="Username"
                  style={{marginBottom: !(errors.username && values.username) && "15px"}}
                />
                {errors.username && values.username && (
                  <ErrorLog message={errors.username} />
                )}
                
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
                  style={{marginBottom: !(errors.password && values.password) && "15px"}}
                  isInvalid={responseErrors.field === 'password'}
                />
              </FormControl>
              {errors.password && values.password && (
                <ErrorLog message={errors.password} />
              )}
              <br />
              {responseErrors.message.length !== 0 &&
              responseErrors.field.length !== 0 ? (
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle>{responseErrors.message}</AlertTitle>
                </Alert>
              ) : null}
              <Button colorScheme="blue" isLoading={isSubmitting} type="submit">
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default withUrqlClient(createUrqlClient)(RegisterPage);
