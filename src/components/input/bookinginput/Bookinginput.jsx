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
    axios.get(`${urls.StrapiUrl}api/publicites`).then((response) => {
      const publiciteData = response.data.data;
      setMediaList(publiciteData);
    });
  }, []);
  const programmationData = () => {
    axios.get(`${urls.StrapiUrl}api/programmations`).then((response) => {
      const programmationList = response.data.data;
      setProgrammedList(programmationList);
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
        <DateTimePicker
          dropdownType="modal"
          label="Date et heure de diffusion"
          placeholder="Veuillez saisir la date et heure de diffusion"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e)}
        />
        <Select
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
          type="submit"
          className={(classes.control, classes.voucher)}
          onClick={() => submitBooking()}
        >
          Enregistrer la programmation
        </Button>
      </SimpleGrid>
      <SimpleGrid cols={1} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
        <ScrollArea>
          {programmedList.map((programm) => (
            <Paper>
              <Text>
                Heure de diffusion : {programm.attributes.datediffusion}
              </Text>
              <Text>Titre du fichier : {programm.attributes.nomfichier}</Text>
            </Paper>
          ))}
        </ScrollArea>
      </SimpleGrid>
    </SimpleGrid>
  );
}
