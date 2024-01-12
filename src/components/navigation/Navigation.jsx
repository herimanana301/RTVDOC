import { useEffect, useState } from "react";
import {
  IconUser,
  IconHome2,
  IconReceipt2,
  IconTicket,
  IconFiles,
  IconUsersGroup,
} from "@tabler/icons-react";

import {
  AppShell,
  Navbar,
  Header,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  createStyles,
  getStylesRef,
} from "@mantine/core";

import General from "../general/General";
import Clients from "../clients/Clients";
import Facture from "../facture/Facture";
import Commande from "../commande/Commande";
import Personal from "../personal/Personal_view";
import Conges from "../personal/conge/conge_view";
import { Welcome } from "../welcome/Welcome";

const data = [
  { link: "", label: "Général", icon: IconHome2 },
  { link: "", label: "Clients", icon: IconUser },
  { link: "", label: "Factures", icon: IconReceipt2 },
  { link: "", label: "Bons de commandes", icon: IconTicket },
  { link: "", label: "Fichier Vidéo et Audio", icon: IconFiles },
  {
    label: "Personnels",
    icon: IconUsersGroup,
    submenu: [
      { link: "", label: "Congés", icon: IconReceipt2 },
      { link: "", label: "Liste du personnel", icon: IconUsersGroup },
    ],
  },
];

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

  submenu: {
    paddingLeft: theme.spacing.lg,
  },
}));

export default function Navigation() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("");
  const links = data.map((item) => (
    <div key={item.label}>
      <a
        className={cx(classes.link, {
          [classes.linkActive]: item.label === active,
        })}
        
        href={item.link}

        onClick={(event) => {
          event.preventDefault();
          setActive(item.label);
          localStorage.setItem("menuActive", item.label);
        }}
      >
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <span>{item.label}</span>
      </a>

      {item.submenu && active === item.label && (
        <div className={classes.submenu}>
          {item.submenu.map((subItem) => (
            <a
              key={subItem.label}
              className={cx(classes.link, {
                [classes.linkActive]: subItem.label === active,
              })}
              href={subItem.link}
              onClick={(event) => {
                event.preventDefault();
                setActive(subItem.label);
                localStorage.setItem("menuActive", subItem.label);
              }}
            >
              <subItem.icon className={classes.linkIcon} stroke={1.5} />
              <span>{subItem.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  ));

  useEffect(() => {
    if (localStorage.getItem("menuActive")) {
      setActive(localStorage.getItem("menuActive"));
    }
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
            <Text style={{ fontWeight: "bold" }}>RTVDOC</Text>
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
      ) : active === "Congés" ? (
        <Conges />
      ) : active === "Liste du personnel" ? (
        <Personal />
      ) : active === "Fichier Vidéo et Audio" ? null : localStorage.getItem(
          "firstConnex"
        ) ? null : (
        <Welcome setActive={setActive} />
      )}
    </AppShell>
  );
}
