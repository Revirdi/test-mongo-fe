import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Image,
  Text,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formLogin, setformLogin] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isLoginProcess, setisLoginProcess] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const { data: session } = useSession();
  const toast = useToast();
  if (session) router.replace("/home");

  const onLoginClick = async (e) => {
    e.preventDefault();
    setisLoginProcess(true);
    const res = await signIn("credentials", {
      redirect: false,
      formLogin,
      password,
    });
    // checking empty field
    if (formLogin == "") {
      setisLoginProcess(false);
      return setErrorMessage("Username field is empty");
    }
    if (password == "") {
      setisLoginProcess(false);
      return setErrorMessage("Password field is empty");
    }

    if (!res.error) {
      router.replace("/home");
    } else {
      toast({
        title: "Login Failed",
        description: "Email / Password is incorect",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
    setisLoginProcess(false);
  };

  return (
    <Stack h={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex flex={1} align={"center"} justify={"center"} alignItems={"center"}>
        <Image
          paddingInline={8}
          rounded="full"
          h={{ base: "50vh", md: "60vh", lg: "70vh" }}
          alt={"Login Image"}
          objectFit={"cover"}
          src={
            "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80"
          }
        />
      </Flex>
      <Flex flex={1} align={"center"} justify={"center"}>
        <form
          onSubmit={onLoginClick}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            paddingInline: "8px",
            paddingBottom: "10px",
          }}
        >
          <Stack spacing={4} w={"full"} maxW={"md"}>
            <Heading fontSize={"2xl"}>Sign in to your account</Heading>
            <Text color={"red.400"} fontSize={"lg"} fontWeight={"semibold"}>
              {errorMessage}
            </Text>

            <FormControl id="email" isRequired>
              <FormLabel>Username or Email</FormLabel>
              <Input
                type="text"
                value={formLogin}
                onChange={(event) => setformLogin(event.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={6}>
              <Text>
                Don't have an account?{" "}
                <NextLink href="/register">
                  <Link color={"blue.400"}>Sign Up</Link>
                </NextLink>
              </Text>
              <Button
                isLoading={isLoginProcess}
                loadingText={"Submit"}
                colorScheme={"blue"}
                variant={"solid"}
                // onClick={onLoginClick}
                type="submit"
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </form>
      </Flex>
    </Stack>
  );
}
