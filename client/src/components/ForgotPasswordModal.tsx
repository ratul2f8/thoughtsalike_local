import {
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Modal,
  useColorMode,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { validateEmail } from "../pages/register";
import React from "react";
import { useForgotPasswordMutation } from "../generated/graphql";
import { withUrqlClient, WithUrqlState } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
const ChangePasswordModal: React.FC<{ open: boolean }> = ({ open }) => {
  React.useEffect(() => {
    setIsOpen(open);
  }, []);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const initialRef = React.useRef();
  const finalRef = React.useRef();
  const onClose = () => setIsOpen(!isOpen);
  const { colorMode } = useColorMode();
  const bgColor = { light: "gray.50", dark: "gray.900" };
  const color = { light: "black", dark: "white" };
  const router = useRouter();
  const[email, setEmail] = React.useState<string>("");
  const[sending, setSending] = React.useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();
  const handleSubmit = async() => {
      setSending(true);
      await forgotPassword({email: email});
      setSending(false);
      router.push("/")
  }

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        >
        <ModalOverlay />
        <ModalContent
         bg={bgColor[colorMode]}
         color={color[colorMode]}
        >
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                ref={initialRef}
                value={email}
                onChange={(event:any) => setEmail(event.target.value)}
                placeholder="email used while creating the account.."
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}
             onClick={handleSubmit}
             isLoading={sending}
             disabled={!validateEmail(email) || sending}
            >
              Send
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default withUrqlClient(createUrqlClient)(ChangePasswordModal);
