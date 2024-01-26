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
  Badge,
  useMantineTheme,
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
  const theme = useMantineTheme();

  useEffect(() => {
    FetchAllConge(setDatas, setPageInfo);
    FetchAllPersonnel(setDatas1, setPageInfo1);
  }, []);

  const filterData = datas
    .filter((data) =>
      search.length > 0
        ? data.attributes.nom.toLowerCase().includes(search.toLowerCase()) ||
          data.attributes.prenom.toLowerCase().includes(search.toLowerCase()) ||
          data.attributes.motif.toLowerCase().includes(search.toLowerCase()) ||
          data.attributes.type_conge
            .toLowerCase()
            .includes(search.toLowerCase())
        : true
    )
    .filter((data) =>
      setupFilter.length > 0
        ? data.attributes.type_conge
            .toLowerCase()
            .includes(setupFilter.toLowerCase())
        : true
    );

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
        {item.attributes.type_conge === "Payé" && (
          <Badge
            color="blue"
            variant={theme.colorScheme === "dark" ? "light" : "dot"}
          >
            {item.attributes.type_conge}
          </Badge>
        )}
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
                data={["", "Payé"]}
                label="Type de congé"
                radius="md"
                value={setupFilter}
                onChange={(value) => setSetupFilter(value.target.value)}
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
