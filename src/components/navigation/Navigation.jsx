import { useEffect, useState } from "react";
import {
  IconUser,
  IconHome2,
  IconReceipt2,
  IconTicket,
  IconCalendar,
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
  Collapse,
} from "@mantine/core";

import General from "../general/General";
import Clients from "../clients/Clients";
import Facture from "../facture/Facture";
import Commande from "../commande/Commande";
import Personal from "../personal/Personal_view";
import Conges from "../personal/conge/conge_view";
import { Welcome } from "../welcome/Welcome";
import Bookinginput from "../input/bookinginput/Bookinginput";
import urls from "../../services/urls";
import axios from "axios";

const data = [
  { link: "", label: "Général", icon: IconHome2 },
  { link: "", label: "Clients", icon: IconUser },
  { link: "", label: "Payement et Factures", icon: IconReceipt2 },
  { link: "", label: "Bons de commandes", icon: IconTicket },
  { link: "", label: "Programmation", icon: IconCalendar },
  {
    label: "Personnels",
    icon: IconUsersGroup,
    submenu: [
      { link: "", label: "Historique congés", icon: IconReceipt2 },
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
  const [authentication, setAuthentication] = useState(false);
  const links = data.map((item) =>
    item.submenu ? (
      <div key={item.label}>
        <a
          className={cx(classes.link, {
            [classes.linkActive]: false,
          })}
          href={item.link}
          onClick={(event) => {
            event.preventDefault();
            setActive(item.label);
          }}
        >
          <item.icon className={classes.linkIcon} stroke={1.5} />
          <span>{item.label}</span>
        </a>
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
      </div>
    ) : (
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
      </div>
    )
  );
  const Selection = () => {
    if (localStorage.getItem("firstConnex") === null) {
      return <Welcome setActive={setActive} />;
    } else {
      switch (active) {
        case "Général":
          return <General />;
        case "Clients":
          return <Clients />;
        case "Payement et Factures":
          return <Facture />;
        case "Bons de commandes":
          return <Commande />;
        case "Historique congés":
          return <Conges />;
        case "Liste du personnel":
          return <Personal />;
        case "Programmation":
          return <Bookinginput />;
        default:
          return null;
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("menuActive")) {
      setActive(localStorage.getItem("menuActive"));
    }
  }, [active]);
  const firstAuthentication = () => {
    const authSubmit = prompt("Entrez le mot de passe connexion");
    localStorage.setItem("authentication", authSubmit);
    location.reload();
  };

  useEffect(() => {
    axios.get(`${urls.StrapiUrl}api/authentications`).then((response) => {
      console.log(response);
      if (
        localStorage.getItem("authentication") ===
        response.data.data[0].attributes.password
      ) {
        setAuthentication(true);
      } else {
        firstAuthentication();
      }
    });
  }, []);

  return (
    <>
      {authentication && (
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
                <Text style={{ fontWeight: "bold" }}>RTV Soafia</Text>
              </div>
            </Header>
          }
        >
          <Selection />
        </AppShell>
      )}
    </>
  );
}
