import axios from "axios";
import {
  SimpleGrid,
  Select,
  Button,
  Paper,
  Text,
  ScrollArea,
  ActionIcon,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useEffect, useState } from "react";
import urls from "../../../services/urls";
import useStyles from "../inputstyles/neworderstyle";
import { IconX } from "@tabler/icons-react";

export default function Bookinginput() {
  const { classes } = useStyles();
  const [mediaList, setMediaList] = useState([]);
  const [selectedUpload, setSelectedUpload] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [programmedList, setProgrammedList] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 1,
  });
  const [paginationPub, setPaginationPub] = useState({
    page: 1,
    pageSize: 1,
  });
  useEffect(() => {
    axios
      .get(
        `${urls.StrapiUrl}api/publicites?pagination[page]=${paginationPub.page}&pagination[pageSize]=20&sort=createdAt:desc`
      )
      .then((response) => {
        const publiciteData = response.data.data;
        const pagination = response.data.meta.pagination;
        setMediaList(publiciteData);
        setPaginationPub((prevData) => {
          return { ...prevData, pageSize: pagination.pageCount };
        });
      });
  }, [paginationPub.page]);
  const programmationData = () => {
    axios
      .get(
        `${urls.StrapiUrl}api/programmations?pagination[page]=${pagination.page}&pagination[pageSize]=50&sort=datediffusion:desc`
      )
      .then((response) => {
        const programmationList = response.data.data;
        const pageSize = response.data.meta.pagination;
        const filteredProgrammationList = programmationList.filter(
          (programm) =>
            new Date(programm.attributes.datediffusion) >= new Date()
        );
        console.log(programmationList);
        setProgrammedList(filteredProgrammationList);
        setPagination((prevData) => {
          return { ...prevData, pageSize: pageSize.pageCount };
        });
      });
  };
  useEffect(() => {
    programmationData();
  }, [pagination.page]);
  const submitBooking = () => {
    try {
      const FileNametoSend = mediaList.find(
        (element) => element.attributes.lien === selectedUpload
      );
      console.log(FileNametoSend);
      axios
        .post(`${urls.StrapiUrl}api/programmations`, {
          data: {
            datediffusion: new Date(selectedDate),
            nomfichier: FileNametoSend.attributes.intitule,
            lien: selectedUpload,
          },
        })
        .then((response) => {
          if (response) {
            programmationData();
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  const handlePagination = (type) => {
    if (type === "next" && pagination.page <= pagination.pageSize) {
      setPagination((prevdata) => {
        return {
          ...prevdata,
          page: pagination.page + 1,
        };
      });
    } else if (type === "prev" && pagination.page >= 1) {
      setPagination((prevdata) => {
        return { ...prevdata, page: pagination.page - 1 };
      });
    }
  };
  const handlePaginationPub = (type) => {
    if (type === "next" && paginationPub.page <= paginationPub.pageSize) {
      setPaginationPub((prevdata) => {
        return {
          ...prevdata,
          page: paginationPub.page + 1,
        };
      });
    } else if (type === "prev" && paginationPub.page >= 1) {
      setPaginationPub((prevdata) => {
        return { ...prevdata, page: paginationPub.page - 1 };
      });
    }
  };
  const handleDeleteProgrammation = (id) => {
    axios
      .delete(`${urls.StrapiUrl}api/programmations/${id}`)
      .then((response) => {
        setProgrammedList((prevData) => {
          return prevData.filter((data) => data.id != id);
        });
      });
  };
  return (
    <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
      <SimpleGrid cols={1} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "3rem",
          }}
        >
          <DateTimePicker
            dropdownType="modal"
            label="Date et heure de diffusion"
            placeholder="Veuillez saisir la date et heure de diffusion"
            value={new Date(selectedDate)}
            onChange={(e) => setSelectedDate(e)}
          />
          <Select
            style={{ paddingTop: "2rem" }}
            label="Publicité à diffuser"
            placeholder="Selectionner le media correspondant"
            searchable
            data={mediaList.map((media) => {
              return {
                value: media.attributes.lien,
                label: media.attributes.intitule,
              };
            })}
            onChange={(e) => setSelectedUpload(e)}
          />
          <div>
            <Button
              onClick={() => {
                handlePaginationPub("prev");
              }}
              disabled={paginationPub.page === 1 ? true : false}
            >
              {"<"}
            </Button>
            <Button
              onClick={() => {
                handlePaginationPub("next");
              }}
              disabled={
                paginationPub.page === paginationPub.pageSize ? true : false
              }
            >
              {">"}
            </Button>
          </div>
          <Text>
            Liste {paginationPub.page}/{paginationPub.pageSize}
          </Text>
          <Button
            style={{ marginTop: "2rem" }}
            type="submit"
            className={(classes.control, classes.voucher)}
            onClick={() => submitBooking()}
          >
            Enregistrer la programmation
          </Button>
        </div>
      </SimpleGrid>
      <SimpleGrid cols={1} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
        <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
          <div>
            <Button
              onClick={() => {
                handlePagination("prev");
              }}
              disabled={pagination.page === 1 ? true : false}
            >
              Précédent
            </Button>
            <Button
              onClick={() => {
                handlePagination("next");
              }}
              disabled={pagination.page === pagination.pageSize ? true : false}
            >
              Suivant
            </Button>
          </div>
          <Text>
            Page {pagination.page}/{pagination.pageSize}
          </Text>
        </SimpleGrid>
        <ScrollArea h={700}>
          {programmedList.map((programm) => (
            <Paper shadow="xl" p="xl" m="xl" key={programm.id}>
              <Text>
                Date de diffusion :{" "}
                {new Date(
                  programm.attributes.datediffusion
                ).toLocaleDateString()}
              </Text>
              <Text>
                Heure de diffusion :{" "}
                {new Intl.DateTimeFormat("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(programm.attributes.datediffusion))}
              </Text>
              <Text>Titre du fichier : {programm.attributes.nomfichier}</Text>
              <ActionIcon
                onClick={() => handleDeleteProgrammation(programm.id)}
                variant="subtle"
                color="red"
              >
                <IconX />
              </ActionIcon>
            </Paper>
          ))}
        </ScrollArea>
      </SimpleGrid>
    </SimpleGrid>
  );
}
