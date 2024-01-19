import { useState } from "react";
import {
  ActionIcon, Autocomplete, Button, Group,
  Menu, NativeSelect, ScrollArea, Table
}
  from "@mantine/core";
import { IconSearch, IconFilter } from "@tabler/icons-react";
import { IconBolt } from "@tabler/icons-react";
import FactureModal from "./FactureModal";

export default function Facture() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const [menuVisible, setMenuVisible] = useState(false);
  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
  };
  const tableData = [
    { id: 1, name: "Facture N° 8395/24", label: "Herimanana Rasolonirina", period: "Du 2024-01-16 au 2024-01-31", qte: "70", pu: "10000", status: "Payé" },
    { id: 2, name: "Facture N° 8396/24", label: "Telma", period: "Du 2024-11-27 au 2024-12-27", qte: "70", pu: "10000", status: "Non Payé" },
  ];
  const rows = tableData.map((item) => (
    <tr key={item.id}>
      <td>{item.name}</td>
      <td>{item.label}</td>
      <td>{item.period}</td>
      <td>{item.qte}</td>
      <td>{item.pu}</td>
      <td>{item.qte * item.pu}</td>
      <td>{item.status}</td>


      <td>
        <Group spacing={0} position="right">
          <ActionIcon onClick={() => handleModal(item)}>
            <IconBolt size="1rem" stroke={1.5} />
          </ActionIcon>
        </Group>
      </td>

    </tr>
  ))

  const handlePrint = () => {
    console.log('Printed !');
  };
  return (
    <div>
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
                data={["", "En attente de diffusion", "En cours de diffusion", "Diffusion terminée"]}
                label="État de diffusion"
                radius="md"
              />
            </Menu.Item>
            <Menu.Item>
              <NativeSelect
                data={["", "Payé", "Non Payé"]}
                label="État de paiement"
                radius="md"
              />
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      {/* Table */}
      <ScrollArea>
        <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Libellé</th>
              <th>Période</th>
              <th>Qte</th>
              <th>P.U.</th>
              <th>Montant</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
      <FactureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedItem={selectedItem}
      />
    </div>
  );
}
