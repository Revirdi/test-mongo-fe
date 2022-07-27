import Head from "next/head";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Flex, Button, Box, Text, HStack, VStack } from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import axiosInstance from "../../services/axios";
import Post from "../../components/Post";
import ProfileBox from "../../components/ProfileBox";
import PostBox from "../../components/PostBox";
import InfiniteScroll from "react-infinite-scroller";

function Home(props) {
  const [post, setPost] = useState(props.post);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [postLength, setPostLength] = useState(props.length);

  // useEffect(() => {
  //   getPost();
  // }, []);

  const isEmpty = !post || post.length === 0;

  const fetchMore = async () => {
    setIsLoading(true);

    const res = await axiosInstance.get("/posts/timeline/all", {
      params: { page: page + 1, pageSize },
    });

    if (res) {
      const newPost = [...post, ...res.data.data];

      console.log(postLength);
      console.log(newPost.length);
      if (newPost.length >= postLength) {
        setHasMore(false);
      }
      setPost(newPost);
      setPage(page + 1);
    }
    setIsLoading(false);
  };

  const getPost = async () => {
    const res = await axiosInstance.get("/posts/timeline/all", {
      params: { page: 1, pageSize: 0 },
    });
    setPost(res.data.data);
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
        {!props.user.isVerified && (
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
          <title>Home</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Sidebar />

        <Flex flexGrow={"0.4"} w="70%" flexDirection="column" marginInline={2}>
          <PostBox user={props.user} getPost={getPost} />
          <InfiniteScroll
            pageStart={1}
            loadMore={fetchMore}
            hasMore={hasMore}
            loader={
              <div className="loader" key={0}>
                Loading ...
              </div>
            }
          >
            {renderPost()}
          </InfiniteScroll>
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

    const { accessToken, userId } = session.user;

    // const config = {
    //   headers: { Authorization: `Bearer ${accessToken}` },
    // };
    const page = 1;
    const pageSize = 3;

    const res = await axiosInstance.get("/users/profile/" + userId);
    const getPost = await axiosInstance.get("/posts/timeline/all", {
      params: { page, pageSize },
    });

    return {
      props: {
        user: res.data.data,
        post: getPost.data.data,
        length: getPost.data.length,
        session,
      },
    };
  } catch (error) {
    console.error(error.response.data);

    return { props: {} };
  }
}

export default Home;
