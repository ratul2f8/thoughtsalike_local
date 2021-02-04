import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import {
  useChangePasswordMutation,
} from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
interface IChangeRequest {
  token: string;
  newPassword: string;
}
const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const [{ fetching }, changePassword] = useChangePasswordMutation();
  const [password, setPassword] = React.useState<string>("");
  const router = useRouter();
  const [error, setError] = React.useState("");
  const handleSubmit = async () => {
    const values: IChangeRequest = { token: token, newPassword: password };
    try{
      await changePassword(values);
    }catch(err){
      setError(err.message);
    }

    // if (response.data?.changePassword.errors?.length !== 0) {
    //   setError(response.data?.changePassword?.errors[0]);
    //   return;
    // } else {
    //   console.log(response.data?.changePassword?.user);
    // }
    router.push("/");
  };
  return (
    <Box display="flex" justifyContent="center" paddingTop="10vh">
      <Stack>
        <Text fontWeight="bold" fontSize="150%">
          Change Password
        </Text>
        <Input
          style={{ width: "60vw", maxWidth: "500px" }}
          variant="filled"
          type="password"
          value={password}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(event.target.value)
          }
        />
        <Text fontSize="70%" fontWeight="bold">
          Length must be greater than 2
        </Text>
        {error !== "" && (
          <Alert status="error" mb="1em" borderRadius="5px">
            <AlertIcon />
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}
        <Box display="flex" justifyContent="center">
          <Button
            color="blueviolet"
            variant="solid"
            disabled={password.length <= 2 || fetching}
            isLoading={fetching}
            onClick={handleSubmit}>
            Change
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};
export default withUrqlClient(createUrqlClient)(ChangePassword);
