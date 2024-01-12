import {
  Paper,
  Text,
  TextInput,
  Select,
  NumberInput,
  Button,
  Group,
  SimpleGrid,
  FileInput,
} from "@mantine/core";
import ContactIcons from "../ContactIcons.jsx";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import { useState } from "react";
import {
  IconPhone,
  IconAt,
  IconUser,
  IconFileSignal,
  IconCalendarTime,
} from "@tabler/icons-react";
import axios from "axios";

//Demande collaboration avec service en retour = Gratuit pour l'annonceur si validation de rabaina
//retracer les moyen de paiement (mobile money, chèque, virement bancaire), avec des numéro de références, les recettes établie

import useStyles from "../inputstyles/neworderstyle.js";

export default function Neworder() {
  const { classes } = useStyles();
  const [datas, setDatas] = useState([
    { title: "Nom complet", description: "", icon: IconUser },
    { title: "Email", description: "", icon: IconAt },
    { title: "Téléphone", description: "", icon: IconPhone },
    {
      title: "Type de diffusion",
      description: "",
      icon: IconFileSignal,
    },
    {
      title: "Durée de diffusion (En jours)",
      description: 1,
      icon: IconCalendarTime,
    },
  ]);
  const updateDescription = (index, newDescription) => {
    setDatas((prevDatas) => {
      const newDatas = [...prevDatas]; // Create a shallow copy of the array
      newDatas[index] = {
        ...newDatas[index],
        description: newDescription,
      }; // Update the description
      return newDatas;
    });
  };

  return (
    <Paper shadow="md" radius="lg">
      <Button component="a" href="/" className={classes.buttonreturn}>
        <IconArrowNarrowLeft size={20} strokeWidth={2} color={"white"} />
        Retour
      </Button>
      <div className={classes.wrapper}>
        <div className={classes.contacts}>
          <ContactIcons variant="white" display={datas} />
        </div>

        <form
          className={classes.form}
          onSubmit={(event) => event.preventDefault()}
        >
          <Text fz="lg" fw={700} className={classes.title}>
            Nouvelle entrée
          </Text>

          <div className={classes.fields}>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <TextInput
                label="Nom complet"
                placeholder="Nom complet"
                value={datas[0].description}
                onChange={(e) => updateDescription(0, e.target.value)}
                required
              />
              <TextInput
                label="Adresse mail"
                placeholder="herimanana@bluepix.mg"
                value={datas[1].description}
                onChange={(e) => updateDescription(1, e.target.value)}
                required
              />
            </SimpleGrid>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <TextInput
                label="Numéro de téléphone"
                placeholder="Numéro de téléphone"
                value={datas[2].description}
                onChange={(e) => updateDescription(2, e.target.value)}
              />
            </SimpleGrid>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <Select
                mt="md"
                label="Type de contenue"
                placeholder="Type de contenue"
                value={datas[3].description}
                onChange={(e) => updateDescription(3, e)}
                data={[
                  { value: "Télévision", label: "Télévision" },
                  { value: "Radio", label: "Radio" },
                  { value: "Radio & télévision", label: "Radio et télévision" },
                ]}
                required
              />
              <NumberInput
                label="Durée de diffusion"
                description="En nombre de jours svp"
                placeholder="Par exemple, le chiffre 10 correspond à 10 jours"
                max={365}
                min={1}
                value={datas[4].description}
                onChange={(e) => updateDescription(4, e)}
              />
            </SimpleGrid>

            <FileInput
              placeholder=".mp4 , .mp3"
              label="Téléverser fichier"
              required
            />
            <Group position="right" mt="md">
              <Button type="submit" className={classes.control}>
                Enregistrer
              </Button>
              <Button
                type="submit"
                className={(classes.control, classes.voucher)}
              >
                Créer bon de commande
              </Button>
            </Group>
          </div>
        </form>
      </div>
    </Paper>
  );
}
