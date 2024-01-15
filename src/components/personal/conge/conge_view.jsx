import { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  Menu,
  NativeSelect,
  Table,
  ScrollArea,
  Group,
  Text,
  rem,
  ActionIcon,
  Avatar,
} from "@mantine/core";


import { IconSearch, IconFilter } from "@tabler/icons-react";
import FetchAllConge from './handle_conge';
import urls from '../../../services/urls';
import AjoutCongeModal from '../conge/nouveau_conge_modal';


export default function Conges() {

  const [menuVisible, setMenuVisible] = useState(false);
  const handleMenuToggle = () => {setMenuVisible(!menuVisible);};
  const [datas, setDatas] = useState([]);
  const [pageInfo, setPageInfo] = useState({page: 1,total: 1,});


  useEffect(() => {

   FetchAllConge(setDatas,setPageInfo);

  }, []);
  
  const rows = datas.map((item) => (
    <tr key={item.id}>
      <td>
        <Group gap="sm">
          <Avatar size={50} radius={50} src={urls.StrapiUrl+'uploads/' + item.attributes.avatar} />
          <Text fz="sm" fw={500}>
            {item.attributes.nom}<br />
            <Text fz="sm" c="dimmed">
            {item.attributes.prenom}
        </Text> 
          </Text>
        </Group>
      </td>

      <td>
        <Text fz="sm" c="dimmed">
          {item.attributes.jour_prise}
        </Text>
      </td>
      <td>
        <Text fz="sm" c="dimmed">
          {item.attributes.jour_restant}
        </Text>
      </td>
      <td>
        <Text fz="sm" c="dimmed">
          {item.attributes.status}
        </Text>
      </td>
    </tr>
  ));


  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>

        <AjoutCongeModal datas={datas}/>

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
      <ScrollArea>
        <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
          <thead>
            <tr>
              <th>Identité</th>
              <th>Jour(s) prise(s)</th>
              <th>Jour(s) restante(s)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>

      </ScrollArea>
    </>
  );
}
