import {
  Paper,
  Text,
  TextInput,
  Button,
  Group,
  SimpleGrid,
  createStyles,
  rem,
  Modal,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import ContactIcons from "./ContactIcons.jsx";

import { IconArrowNarrowLeft } from "@tabler/icons-react";
import { useState } from "react";
import {
  IconPhone,
  IconMapPin,
  IconAt,
  IconUser,
  IconFileBarcode,
  IconUpload,
  IconPhoto,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import checked from "../../assets/icons/checked.gif";
import wrong from "../../assets/icons/wrong.gif";
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
    popup: {
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
      display: "flex",
      justifyContent: "space-evenly",
      flexDirection: "row",
      alignItems: "center",
      paddingBottom: rem(50),
      fontSize: rem(20),
    },
  };
});

export default function NewClient() {
  const { classes } = useStyles();
  const [datas, setDatas] = useState([
    { title: "Raison social", description: "", icon: IconUser },
    { title: "Email", description: "", icon: IconAt },
    { title: "Téléphone", description: "", icon: IconPhone },
    {
      title: "Adresse",
      description: "",
      icon: IconMapPin,
    },
    {
      title: "NIF",
      description: "",
      icon: IconFileBarcode,
    },
    {
      title: "STAT",
      description: "",
      icon: IconFileBarcode,
    },
  ]);
  const updateDescription = (index, newDescription) => {
    setDatas((prevDatas) => {
      const newDatas = [...prevDatas];
      newDatas[index] = {
        ...newDatas[index],
        description: newDescription,
      };
      return newDatas;
    });
  };
  const [opened, setOpened] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [pathFile, setPathFile] = useState("");
  const submitButton = async () => {
    await axios
      .post("http://localhost:1337/api/clients", {
        data: {
          raisonsocial: datas[0].description,
          adresse: datas[3].description,
          email: datas[1].description,
          phonenumber: datas[2].description,
          NIF: datas[4].description,
          STAT: datas[5].description,
        },
      })
      .then((response) => {
        console.log(response);
        response.status === 200 && setOpened(true);
        const updatedDatas = datas.map((element) => ({
          ...element,
          description: "",
        }));
        setDatas(updatedDatas);
      })
      .catch((error) => {
        console.error(error);
        setSubmitError(true);
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
            Nouveau client
          </Text>

          <div className={classes.fields}>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <TextInput
                label="Raison social"
                placeholder="Ex: RTV SOAFIA"
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
              <TextInput
                mt="md"
                label="Adresse"
                placeholder="Adresse de l'entreprise client"
                value={datas[3].description}
                onChange={(e) => updateDescription(3, e.target.value)}
              />
            </SimpleGrid>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <TextInput
                mt="md"
                label="NIF"
                placeholder=""
                value={datas[4].description}
                onChange={(e) => updateDescription(4, e.target.value)}
              />
              <TextInput
                mt="md"
                label="STAT"
                placeholder=""
                value={datas[5].description}
                onChange={(e) => updateDescription(5, e.target.value)}
              />
            </SimpleGrid>
            <Text size="md" style={{ paddingTop: rem(15) }}>
              Photo de profil
            </Text>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <Dropzone
                onDrop={(files) => {
                  setPathFile(files[0].path);
                  set;
                }}
                maxSize={5 * 1024 ** 2}
                accept={[
                  "image/png",
                  "image/jpeg",
                  "image/sgv+xml",
                  "image/gif",
                ]}
              >
                <Group
                  justify="center"
                  gap="xl"
                  mih={220}
                  style={{ pointerEvents: "none" }}
                >
                  <Dropzone.Accept>
                    <IconUpload
                      style={{
                        width: rem(52),
                        height: rem(52),
                        color: "var(--mantine-color-blue-6)",
                      }}
                      stroke={1.5}
                    />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX
                      style={{
                        width: rem(52),
                        height: rem(52),
                        color: "var(--mantine-color-red-6)",
                      }}
                      stroke={1.5}
                    />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconPhoto
                      style={{
                        width: rem(52),
                        height: rem(52),
                        color: "var(--mantine-color-dimmed)",
                      }}
                      stroke={1.5}
                    />
                  </Dropzone.Idle>

                  <div>
                    <Text size="xl" inline>
                      {pathFile.length > 0
                        ? pathFile
                        : "Glissez ici ou cliquez ici pour soumettre des fichiers"}
                    </Text>
                  </div>
                </Group>
              </Dropzone>
            </SimpleGrid>

            <Group position="right" mt="md">
              <Button
                type="submit"
                className={classes.control}
                onClick={submitButton}
              >
                Enregistrer
              </Button>
            </Group>
          </div>
        </form>
        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          transitionProps={{
            transition: "fade",
            duration: "600",
            timingFunction: "ease",
          }}
        >
          {submitError ? (
            <div className={classes.popup}>
              <img src={wrong} alt="checked" />
              <span>Erreur lors de l'enregistrement</span>
            </div>
          ) : (
            <div className={classes.popup}>
              <img src={checked} alt="checked" />
              <span>Client bien enregistré</span>
            </div>
          )}
        </Modal>
      </div>
    </Paper>
  );
}
