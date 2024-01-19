import { useState } from "react";
import { ActionIcon, Anchor, Autocomplete, Button, Group, Menu, Modal, NativeSelect, ScrollArea, Table, Text  } from "@mantine/core";
import { IconSearch, IconFilter } from "@tabler/icons-react";
import { IconBolt } from "@tabler/icons-react";

export default function Facture() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModal = () => {
    setIsModalOpen(true);
  };

  const [menuVisible, setMenuVisible] = useState(false);
  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
  };
  const tableData = [
    { id: 1, name: "Facture N° 8395/24", label: "Herimanana Rasolonirina", period: "Du 2024-01-16 au 2024-01-31", qte: "70", pu: "10000", status: "Payé"},
    { id: 2, name: "Facture N° 8396/24", label: "Telma", period: "Du 2024-11-27 au 2024-12-27", qte: "70", pu: "10000", status: "Non Payé"},
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

      {item.status === "Payé" && (
        <td>
          <Group spacing={0} position="right">
            <ActionIcon onClick={ handleModal }>
              <IconBolt size="1rem" stroke={1.5}/>
            </ActionIcon>
          </Group>
        </td>
      )}

    </tr>
  ));

  const rowsPreview = tableData.map((item) => {
    <tr key={ item.id }>
      <td>{ item.period }</td>
      <td>{ item.label }</td>
      <td>{ item.qte }</td>
      <td>{ item.pu }</td>
      <td>{ item.pu * item.qte }</td>
    </tr>
  });
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
                label="Ètat de paiement"
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
    <Modal
      opened={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      style={{ alignItems: 'center'}}
      title={<Text fz="sm" fw={500}>Aperçu de la facture</Text>}
      centered
    >
      {/* APERCU DE LA FACTURE */}
      <Text fz="xs">
        <div style={{ display: "flex", justifyContent: "space-between"}}> 
          <span>
            <div style={{ display: "flex"}}>
              <span>ICON</span>
              <span>
                <h1>SOAFIA YJOANA</h1>
                <p>
                  Immeuble INTERCENTER <br />
                  Tambohobe - Ampasambazaha <br />
                  301 - FIANARANTSOA <br />
                </p>
              </span>
            </div>
            <div>
              <p>
                BFV-SG n°0008 01340 05003017343 29 <br />
                NIF: 4004125945 <br />
                STAT: 10717 21 2020 0 00975 du 21/09/20 <br />
                RCS: 2020 B 00022 du 25/09/20 <br />
                CIF: 0040969/DGI-J du 21/06/2022 <br />
              </p>
            </div>
          </span>
          <span>
            <p>
              TITULAIRE DE COMPTE (BFV) <br />
              YJOANA SARL RADIO RTV 103 <br />
              DOMICILIATION <br />
              01340 FIANARANTSOA <br />
              REFERENCES BANCAIRES <br />
              Code Banque 00008 <br />
              Code Agence 01340 <br />
              N° de compte 05003017343 <br />
              Clé 29
            </p>
          </span>
        </div>
        <div style={{ display:"flex", flexDirection:"column"}}>
          <div style={{ padding: "15px", border: "1px solid black", textAlign: "center"}}>
            Facture N° 8395/23
          </div>
          <div style={{fontWeight: "bold"}}><span style={{ textDecoration: "underline", }}>Doit </span>{"Herimanana Rasolonirina"}
          <br />suivant BC {"N°UMT/010100305/10-23UMATEC"} du {"16/10/23"}
          </div><br />

          <Table>
            <thead>
              <tr>
                <th>PERIODE</th>
                <th>LIBELLES</th>
                <th>QTE</th>
                <th>PRIX UNIT</th>
                <th>MONTANT</th>
              </tr>
            </thead>
            <tbody>{rowsPreview}</tbody>
          </Table>
        </div>
        
      </Text>
      
      <Button
        variant="gradient"
        gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
        style = {{ marginTop: 15}}
      >
        Imprimer
      </Button>
    </Modal>
    </div>
    
    
  );
}
