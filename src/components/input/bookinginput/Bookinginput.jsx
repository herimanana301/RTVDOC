import axios from "axios";
import {
  SimpleGrid,
  Select,
  Button,
  Paper,
  Text,
  ScrollArea,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useEffect, useState } from "react";
import urls from "../../../services/urls";
import useStyles from "../inputstyles/neworderstyle";

export default function Bookinginput() {
  const { classes } = useStyles();
  const [mediaList, setMediaList] = useState([]);
  const [selectedUpload, setSelectedUpload] = useState({ lien: "", nom: "" });
  const [selectedDate, setSelectedDate] = useState("");
  const [programmedList, setProgrammedList] = useState([]);
  useEffect(() => {
    axios.get(`${urls.StrapiUrl}api/publicites?_limit=-1`).then((response) => {
      const publiciteData = response.data.data;
      setMediaList(publiciteData);
    });
  }, []);
  const programmationData = () => {
    axios
      .get(`${urls.StrapiUrl}api/programmations?_limit=-1`)
      .then((response) => {
        const programmationList = response.data.data;
        const filteredProgrammationList = programmationList.filter(
          (programm) =>
            new Date(programm.attributes.datediffusion) >= new Date()
        );
        setProgrammedList(filteredProgrammationList);
      });
  };
  useEffect(() => {
    programmationData();
  }, []);
  const submitBooking = () => {
    try {
      axios
        .post(`${urls.StrapiUrl}api/programmations`, {
          data: {
            datediffusion: new Date(selectedDate),
            nomfichier: selectedUpload.nom,
          },
        })
        .then((response) => {
          if (response) {
            setSelectedDate("");
            setSelectedUpload("");
            programmationData();
          }
        });
    } catch (error) {
      console.log(error);
    }
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
            value={selectedDate}
            onChange={(e) => setSelectedDate(e)}
          />
          <Select
            style={{ paddingTop: "2rem" }}
            label="Publicité à diffuser"
            placeholder="Selectionner le media correspondant"
            searchable
            data={mediaList.map((media) => {
              return {
                value: {
                  lien: media.attributes.lien,
                  nom: media.attributes.intitule,
                },
                label: media.attributes.intitule,
              };
            })}
            onChange={(e) => setSelectedUpload({ lien: e.lien, nom: e.nom })}
          />
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
            </Paper>
          ))}
        </ScrollArea>
      </SimpleGrid>
    </SimpleGrid>
  );
}
