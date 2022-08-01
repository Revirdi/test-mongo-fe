import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { useState, useEffect } from "react";

function MyApp({ Component, pageProps }) {
  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);
  if (!showChild) {
    return null;
  }
  if (typeof window === "undefined") {
    return <></>;
  } else {
    return (
      <SessionProvider session={pageProps.session}>
        <ChakraProvider>
          <Head>
            <title>Cuiters</title>
            <meta name="description" content="One stop best Sosmed probably" />
            <link rel="icon" href="/twitter.ico" />
          </Head>
          <Component {...pageProps} />
        </ChakraProvider>
      </SessionProvider>
    );
  }
}

export default MyApp;
