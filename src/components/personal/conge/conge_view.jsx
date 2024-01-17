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
import FetchAllConge from "./handle_conge";
import { FetchAllPersonnel } from "./handle_conge";
import urls from "../../../services/urls";
import AjoutCongeModal from "../conge/nouveau_conge_modal";
import { DatePickerInput } from "@mantine/dates";

export default function Conges() {
  const [menuVisible, setMenuVisible] = useState(false);
  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
  };
  const [datas, setDatas] = useState([]);
  const [search, setSearch] = useState("");
  const [setupFilter, setSetupFilter] = useState("");
  const [pageInfo, setPageInfo] = useState({ page: 1, total: 1 });
  const [datas1, setDatas1] = useState([]);
  const [pageInfo1, setPageInfo1] = useState({ page: 1, total: 1 });

  useEffect(() => {
    FetchAllConge(setDatas, setPageInfo);
    FetchAllPersonnel(setDatas1, setPageInfo1);

  }, []);
  const filterData =
    search.length > 0
      ? datas.filter(
          (data) =>
            data.attributes.nom.toLowerCase().includes(search) ||
            data.attributes.prenom.toLowerCase().includes(search) ||
            data.attributes.motif.toLowerCase().includes(search) ||
            data.attributes.type_conge.toLowerCase().includes(search)
        )
      : search === "Blacklisté"
      ? datas.filter((data) => data.attributes.blacklist)
      : setupFilter === "Plus récent"
      ? datas.sort((a, b) => {
          return (
            new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
          );
        })
      : setupFilter === "Plus ancien"
      ? datas.sort((a, b) => {
          return (
            new Date(a.attributes.createdAt) - new Date(b.attributes.createdAt)
          );
        })
      : datas;
  const rows = filterData.map((item) => (
    <tr key={item.id}>
      <td>
        <Group gap="sm">
          <Avatar
            size={50}
            radius={50}
            src={urls.StrapiUrl + "uploads/" + item.attributes.avatar}
          />
          <Text fz="sm" fw={500}>
            {item.attributes.nom}
            <br />
            <Text fz="sm" c="dimmed">
              {item.attributes.prenom}
            </Text>
          </Text>
        </Group>
      </td>

      <td>
        <DatePickerInput
          dropdownType="modal"
          type="range"
          valueFormat="DD MMM YYYY"
          allowSingleDateInRange
          value={[
            new Date(item.attributes.date_debut_conge),
            new Date(item.attributes.date_fin_conge),
          ]}
          style={{ maxWidth: "190px" }}
        />
      </td>

      <td>
        <Text fz="sm" c="dimmed">
          {item.attributes.jour_prise}
        </Text>
      </td>

      <td>
        <Text fz="sm" c="dimmed">
          {item.attributes.motif}
        </Text>
      </td>
      <td>
        <Text fz="sm" c="dimmed">
          {item.attributes.type_conge}
        </Text>
      </td>
    </tr>
  ));

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <AjoutCongeModal datas={datas1} />

        <Autocomplete
          placeholder="Rechercher"
          icon={<IconSearch size="1rem" stroke={1.5} />}
          data={[]}
          value={search}
          onChange={(e) => setSearch(e)}
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
                data={["", "Plus récent", "Plus ancien"]}
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
              <th>Nombre de jour</th>
              <th>Motif</th>
              <th>Type de congé</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </>
  );
}
