import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* <link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="images/favicon-16x16.png" />
        <link rel="icon" href="images/favicon.ico" />
        <link rel="manifest" href="images/site.webmanifest" />
        <link rel="icon" type="image/png" sizes="192x192" href="images/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="images/android-chrome-512x512.png" /> */}

        <link rel="shortcut icon" href="\images\concretionlogo.png" type="image/x-icon" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
