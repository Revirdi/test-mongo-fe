import Head from "next/head";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Flex, Button, Box, Text, HStack, VStack } from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import axiosInstance from "../../services/axios";
import Post from "../../components/Post";
import ProfileBox from "../../components/ProfileBox";
import InfiniteScroll from "react-infinite-scroller";

function Home(props) {
  const [post, setPost] = useState(props.post);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [postLength, setPostLength] = useState(props.length);

  useEffect(() => {
    getPost();
  }, []);

  const fetchMore = async () => {
    if (postLength <= pageSize) {
      setHasMore(false);
    }
    setTimeout(async () => {
      const session = await getSession();
      const { accessToken } = session.user;
      const config = {
        params: { page: page + 1, pageSize },
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      const res = await axiosInstance.get("/posts/timeline/liked", config);

      if (res) {
        const newPost = [...post, ...res.data.data];
        if (newPost.length >= postLength) {
          setHasMore(false);
        }
        setPost(newPost);
        setPage(page + 1);
      }
    }, 500);
  };

  const getPost = async () => {
    const session = await getSession();
    const { accessToken } = session.user;
    const config = {
      params: { page: 1, pageSize },
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const res = await axiosInstance.get("/posts/timeline/liked", config);

    setPost(res.data.data);
    setPostLength(res.data.length);
    setPage(1);
    setHasMore(true);
  };

  const resendHandler = async () => {
    setIsLoading(!isLoading);
    const body = {
      email: props.user.email,
      userId: props.user._id,
    };
    await axiosInstance.post("/auth/verify", body);
    alert("Success sending email");
    setIsLoading(false);
  };

  const renderPost = () => {
    return post.map((pst) => {
      return (
        <Post
          key={pst._id}
          post={pst}
          user={props.user}
          getPost={getPost}
        ></Post>
      );
    });
  };

  return (
    <VStack>
      <Box backgroundColor={"gray.100"} mt="2" rounded="12">
        {!props.user?.isVerified && (
          <HStack paddingBlock="1" paddingInline="6">
            <Text>Click to resend a verification and check your email</Text>
            <Button
              isLoading={isLoading}
              backgroundColor={"yellow.300"}
              onClick={resendHandler}
            >
              Resend
            </Button>
          </HStack>
        )}
      </Box>
      <Flex
        height="100vh"
        width="full"
        maxWidth="100vw"
        ms="auto"
        me="auto"
        padding="0 10px"
      >
        <Head>
          <title>Liked Post</title>
          <meta name="Liked Post" content="Liked Post" />
          <link rel="icon" href="/twitter.ico" />
        </Head>

        <Sidebar />

        <Flex flexGrow={"0.4"} w="70%" flexDirection="column" marginInline={2}>
          {post ? (
            <InfiniteScroll
              pageStart={0}
              loadMore={fetchMore}
              hasMore={hasMore}
              loader={
                <Box
                  rounded={5}
                  boxShadow="md"
                  marginBottom={2}
                  padding="2"
                  marginInlineStart={"25%"}
                  key={0}
                >
                  Loading ...
                </Box>
              }
            >
              {renderPost()}
            </InfiniteScroll>
          ) : (
            <Box
              rounded={5}
              boxShadow="md"
              marginBottom={2}
              padding="2"
              marginInlineStart={"25%"}
            >
              <h1>Tidak ada post</h1>
            </Box>
          )}
        </Flex>
        <ProfileBox user={props.user} />
      </Flex>
    </VStack>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });

    if (!session) return { redirect: { destination: "/login" } };

    const { userId } = session.user;

    const res = await axiosInstance.get("/users/profile/" + userId);

    return {
      props: {
        user: res.data.data,
        session,
      },
    };
  } catch (error) {
    console.error(error.response.data);
    const { message } = error;

    return { props: { message } };
  }
}

export default Home;
