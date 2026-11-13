import type { AppProps } from "next/app";
import {
  MantineProvider,
  Global,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { ApolloWrapper } from "../src/Utilities/ApolloWrapper";
import { AppLayout } from "../src/Components/Containers/AppLayout";
import { NotificationsProvider } from "@mantine/notifications";
import { useState } from "react";
import { useLocalStorage } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";

function MyApp({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ApolloWrapper>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{ colorScheme }}
        >
          <NotificationsProvider position="top-right">
            <ModalsProvider>
              <AppLayout>
                <Component {...pageProps} />
              </AppLayout>
            </ModalsProvider>
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </ApolloWrapper>
  );
}

export default MyApp;
