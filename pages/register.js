import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import axiosInstance from "../services/axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isRegisterProcess, setisRegisterProcess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();

  const { data: session } = useSession();

  if (session) router.replace("/home");

  const onRegisterClick = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      setisRegisterProcess(true);
      // check password
      if (password != password2)
        return setErrorMessage("password did not match");
      const body = {
        username,
        email,
        password: password2,
      };
      const res = await axiosInstance.post("/auth/register", body);
      setSuccessMessage(res.data.message);
      setTimeout(() => router.push("/login"), 3000);
    } catch (error) {
      if (error.response.data)
        return setErrorMessage(error.response.data.message);
      setErrorMessage(error.message);
    } finally {
      setisRegisterProcess(false);
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
          width={"25vw"}
        >
          <Stack spacing={4}>
            <Text color={"red.500"} fontSize={"lg"} fontWeight={"semibold"}>
              {errorMessage}
            </Text>
            <Text color={"green.500"} fontSize={"lg"} fontWeight={"semibold"}>
              {successMessage}
            </Text>
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                placeholder="username"
                onChange={(event) => setUsername(event.target.value)}
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                placeholder="your@mail.com"
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="***********"
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
            <FormControl id="password" isRequired>
              <FormLabel>Re-Enter your password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword2 ? "text" : "password"}
                  value={password2}
                  placeholder="***********"
                  onChange={(event) => setPassword2(event.target.value)}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword2((showPassword2) => !showPassword2)
                    }
                  >
                    {showPassword2 ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                isLoading={isRegisterProcess}
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={onRegisterClick}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already have an account?{" "}
                <NextLink href="/login">
                  <Link color={"blue.400"}>Sign In</Link>
                </NextLink>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
