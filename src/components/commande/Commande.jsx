import {
  Autocomplete,
  Button,
  Menu,
  NativeSelect,
  Text,
  Accordion,
  Group,
} from "@mantine/core";
import { IconSearch, IconFilter } from "@tabler/icons-react";
import { Calendar } from "@mantine/dates";
import { useState, useEffect } from "react";
import Orders from "../general/Orders";

export default function Commande() {
  const [menuVisible, setMenuVisible] = useState(false);
  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 1,
  });
  const handlePagination = (type) => {
    if (type === "next" && pagination.page <= pagination.pageSize) {
      setPagination((prevdata) => {
        return {
          ...prevdata,
          page: pagination.page + 1,
        };
      });
    } else if (type === "prev" && pagination.page > 0) {
      setPagination((prevdata) => {
        return { ...prevdata, page: pagination.page - 1 };
      });
    }
  };
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button component="a" href="/neworder">
          + Nouveau
        </Button>

        <Autocomplete
          placeholder="Rechercher"
          icon={<IconSearch size="1rem" stroke={1.5} />}
          data={[]}
          value={searchQuery}
          onChange={(value) => setSearchQuery(value)}
        />
        <div>
          <Button
            onClick={() => {
              handlePagination("prev");
            }}
            disabled={pagination.page === 1 ? true : false}
          >
            {"<"}
          </Button>
          <Button
            onClick={() => {
              handlePagination("next");
            }}
            disabled={pagination.page === pagination.pageSize ? true : false}
          >
            {">"}
          </Button>
        </div>
        <Text>
          Page {pagination.page}/{pagination.pageSize}
        </Text>
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
                data={[
                  "",
                  "En attente de diffusion",
                  "En cours de diffusion",
                  "Diffusion terminée",
                ]}
                label="État de diffusion"
                radius="md"
                value={filterStatus}
                onChange={(value) => setFilterStatus(value.target.value)}
              />
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      <Orders
        searchQuery={searchQuery}
        filterStatus={filterStatus}
        paginationPage={pagination.page}
        setPagination={setPagination}
      />
    </>
  );
}
