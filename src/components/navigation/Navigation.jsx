import { useEffect, useState } from "react";
import {
  IconUser,
  IconHome2,
  IconReceipt2,
  IconTicket,
  IconFiles,
} from "@tabler/icons-react";

import {
  AppShell,
  Navbar,
  Header,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Autocomplete,
  createStyles,
  Group,
  Code,
  getStylesRef,
  rem,
} from "@mantine/core";
import General from "../general/General";
import Clients from "../clients/Clients";
import Facture from "../facture/Facture";
import Commande from "../commande/Commande";

const data = [
  { link: "", label: "Général", icon: IconHome2 },
  { link: "", label: "Clients", icon: IconUser },
  { link: "", label: "Factures", icon: IconReceipt2 },
  { link: "", label: "Bons de commandes", icon: IconTicket },
  { link: "", label: "Fichier Vidéo et Audio", icon: IconFiles },
]; // ajout de menu

const useStyles = createStyles((theme) => ({
  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,

      [`& .${getStylesRef("icon")}`]: {
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },
  },

  linkIcon: {
    ref: getStylesRef("icon"),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
      [`& .${getStylesRef("icon")}`]: {
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
      },
    },
  },
}));

export default function Navigation() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("Général");
  const links = data.map((item) => (
    <a
      className={cx(classes.link, {
        [classes.linkActive]: item.label === active,
      })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));
  useEffect(() => {
    console.log(active);
  }, [active]);
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          {links}
        </Navbar>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <Text style={{ fontWeight: "bold" }}>BLUEPAPERS</Text>
          </div>
        </Header>
      }
    >
      {active === "Général" ? (
        <General />
      ) : active === "Clients" ? (
        <Clients />
      ) : active === "Factures" ? (
        <Facture />
      ) : active === "Bons de commandes" ? (
        <Commande />
      ) : null}
      {/* Permet de gérer l'affichage des composants par rapport au menu selectionné*/}
    </AppShell>
  );
}
