import {
  Paper,
  Text,
  TextInput,
  Select,
  NumberInput,
  Button,
  Group,
  SimpleGrid,
  createStyles,
  rem,
  FileInput,
} from "@mantine/core";
import ContactIcons from "../ContactIcons.jsx";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import { useState } from "react";
import {
  IconSun,
  IconPhone,
  IconMapPin,
  IconAt,
  IconUser,
  IconFileSignal,
  IconCalendarTime,
} from "@tabler/icons-react";

//Demande collaboration avec service en retour = Gratuit pour l'annonceur si validation de rabaina
//retracer les moyen de paiement (mobile money, chèque, virement bancaire), avec des numéro de références, les recettes établie

const useStyles = createStyles((theme) => {
  const BREAKPOINT = theme.fn.smallerThan("sm");

  return {
    buttonreturn: {
      marginBottom: rem(20),
    },
    wrapper: {
      display: "flex",
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
      borderRadius: theme.radius.lg,
      padding: rem(4),
      border: `${rem(1)} solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[8]
          : theme.colors.gray[2]
      }`,

      [BREAKPOINT]: {
        flexDirection: "column",
      },
    },

    form: {
      boxSizing: "border-box",
      flex: 1,
      padding: theme.spacing.xl,
      paddingLeft: `calc(${theme.spacing.xl} * 2)`,
      borderLeft: 0,

      [BREAKPOINT]: {
        padding: theme.spacing.md,
        paddingLeft: theme.spacing.md,
      },
    },

    fields: {
      marginTop: rem(-12),
    },

    fieldInput: {
      flex: 1,

      "& + &": {
        marginLeft: theme.spacing.md,

        [BREAKPOINT]: {
          marginLeft: 0,
          marginTop: theme.spacing.md,
        },
      },
    },

    fieldsGroup: {
      display: "flex",

      [BREAKPOINT]: {
        flexDirection: "column",
      },
    },

    contacts: {
      boxSizing: "border-box",
      position: "relative",
      borderRadius: theme.radius.lg,
      backgroundSize: "cover",
      backgroundPosition: "center",
      border: `${rem(1)} solid transparent`,
      //padding: theme.spacing.xl,
      flex: `0 0 ${rem(280)}`,

      [BREAKPOINT]: {
        marginBottom: theme.spacing.sm,
        paddingLeft: theme.spacing.md,
      },
    },

    title: {
      marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,

      [BREAKPOINT]: {
        marginBottom: theme.spacing.xl,
      },
    },

    control: {
      [BREAKPOINT]: {
        flex: 1,
      },
    },
    voucher: {
      backgroundColor: "orange",
    },
  };
});

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
