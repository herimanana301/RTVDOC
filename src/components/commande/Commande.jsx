import {
    Autocomplete,
    Button,
    Menu,
    NativeSelect,
    Accordion,
    Group,
  } from "@mantine/core";
  import { IconSearch, IconFilter } from "@tabler/icons-react";
  import { Calendar } from "@mantine/dates";
  import { useState } from "react";
  import Orders from "../general/Orders";
  
  export default function Commande() {
    const [menuVisible, setMenuVisible] = useState(false);
    const handleMenuToggle = () => {
      setMenuVisible(!menuVisible);
    };
    return (
      <>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button component="a" href="/creer">
            + Nouveau
          </Button>
          <Autocomplete
            placeholder="Rechercher"
            icon={<IconSearch size="1rem" stroke={1.5} />}
            data={[]}
          />
          <Menu
            shadow="md"
            width={"auto"}
            position="left"
            offset={5}
            opened={menuVisible}
          >
            <Menu.Target>
              <Button onClick={handleMenuToggle}>
                <IconFilter size="1.1rem" stroke={2} />
                Filtre
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>
                <NativeSelect
                  data={["", "En attente de diffusion", "En cours de diffusion"]}
                  label="État de diffusion"
                  radius="md"
                />
              </Menu.Item>
              <Menu.Item>
                <NativeSelect
                  data={["", "Payé", "Non Payé"]}
                  label="Ètat de paiement"
                  radius="md"
                />
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
        <Accordion
          style={{ marginTop: "2rem" }}
          variant="contained"
          radius="md"
          defaultValue="customization"
        >
          <Accordion.Item value="date">
            <Accordion.Control>Date des données : 29/07/2023 </Accordion.Control>
            <Accordion.Panel>
              <Group position="center">
                <Calendar />
              </Group>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        <Orders />
      </>
    );
  }
  