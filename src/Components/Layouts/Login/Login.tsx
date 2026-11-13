import React, { useState } from "react";
import { Button } from "../../Elements/Button";
import { Input } from "../../Elements/Input";
import { Image } from "../../Elements/Image";
import LogoDark from "../../../../assets/LOGO_DARK.png";
import LogoLight from "../../../../assets/LOGO.png";

import { useStyles } from "./Login.styles";
import { ForgotPassword } from "../ForgotPassword";
import { useForm } from "@mantine/form";
import { useMantineColorScheme, Paper, Text } from "@mantine/core";
import { useRouter } from "next/router";
import Amplify, { Auth } from "../../../Utilities/Backend";
import LoginActions from "../../../Actions/LoginActions";
import Notification from "../../Elements/Notification/Notification";
import Head from "next/head";
import { Group, PasswordInput, Stack } from "../../Elements";
import { useViewportSize } from "@mantine/hooks";
import { isTabletMobileView } from "../../../Utilities/Formatter";

export const Login = () => {
  const { classes } = useStyles();
  const { height, width } = useViewportSize();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loggedUser, setLoggedUser] = useState();
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const { colorScheme } = useMantineColorScheme();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: any) => {
    setIsLoading(true);
    LoginActions.login(values)
      .then((user) => {
        setLoggedUser(user);
        setIsLoading(false);
        localStorage.removeItem("channel");
        // router.push("/");
        location.reload();
      })
      .catch((e) => {
        Notification.error({ message: e.message });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className={classes.main}>
      <Head>
        <title>IQOS | Login</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <ForgotPassword
        visible={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
      <div className={classes.card}>
        <Paper
          // style={{width: width <= isTabletMobileView ? undefined: 500}}
          radius={10}
          withBorder
          style={{ width: width <= 768 ? undefined : 500 }}
        >
          <div className={classes.form}>
            <Stack>
              <div className={classes.logo}>
                <Image
                  alt="LOGO"
                  src={colorScheme === "dark" ? LogoLight : LogoDark}
                />
              </div>

              <Text fw={"bold"} size={30}>
                Welcome back!
              </Text>
              <Text>Login to your account</Text>
              <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
                <Stack>
                  <Input
                    {...form.getInputProps("username")}
                    className={classes.input}
                    placeholder="Enter Username"
                    required
                  />
                  <PasswordInput
                    {...form.getInputProps("password")}
                    className={classes.input}
                    required
                    placeholder="Enter Password"
                  />
                  <Group position="right">
                    <Button
                      compact
                      variant="subtle"
                      customType="link"
                      size="xs"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot Password?
                    </Button>
                  </Group>
                  <Group position="center">
                    <Button fullWidth type={"submit"} loading={isLoading}>
                      Login
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Stack>
          </div>
        </Paper>
      </div>
    </div>
  );
};
