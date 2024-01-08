import { useState } from "react";
import { Autocomplete, Button, Menu, NativeSelect } from "@mantine/core";
import { IconSearch, IconFilter } from "@tabler/icons-react";

export default function Facture() {
  const [menuVisible, setMenuVisible] = useState(false);
  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Button component="a" href="/newinvoice">
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
  );
}
