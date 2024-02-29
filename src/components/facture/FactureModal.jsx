import React from "react";
import {
  Modal,
  Select,
  SimpleGrid,
  Button,
  Text,
  Group,
  ActionIcon,
  NumberInput,
  TextInput,
  Menu,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { IconCardsFilled, IconPrinter, IconArchive, IconFolderUp} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArchiverCommandeConfirm,
  DesarchiverCommandeConfirm,
} from "../../services/alertConfirmation";
import { ArchiverCommande, DesarchiverCommande } from "./hanldeFacture";
import { FindCommandeData, InsertFacture, UpdateFacture } from "./hanldeFacture";

import {
  IconDots,
} from "@tabler/icons-react";

export default function FactureModal(props) {
  const { id, archive } = props.datas;
  const [opened, { open, close }] = useDisclosure(false);

  const [refPayement, setRefPayement] = useState("");
  const [datePayementIs, setdatePayementIs] = useState(false);
  const [refPayementIs, setrefPayementIs] = useState(false);
  const [typePayementIs, settypePayementIs] = useState(false);

  const [FormData, setFormData] = useState({
    datePayement: new Date(),
    avanceMontant: 0,
    restePayement: 0,
    montantTotal: 0,
    typePayement: "Totalement-payé",
  });

  const [datasPrestation, setDatasPrestation] = useState([]);
  const [datasPayement, setDatasPayement] = useState();
  const [datasCommande, setDatasCommande] = useState([]);
  const [error, setError] = useState(false);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    total: 1,
  });

  useEffect(() => {
    FindCommandeData(
      id,
      setDatasCommande,
      setPageInfo,
      setDatasPrestation,
      setDatasPayement
    );
  }, []);

  useEffect(() => {
    if (datasPayement) {
      if (datasPayement.attributes.typePayement === "Partiellement-payé") {
        setFormData({
          datePayement: new Date(datasPayement.attributes.datePayement),
          avanceMontant: datasPayement.attributes.avance,
          restePayement:
            datasPayement.attributes.montantTotal -
            datasPayement.attributes.avance,
          montantTotal: datasPayement.attributes.montantTotal,
          typePayement: datasPayement.attributes.typePayement,
        });
      } else {
        setFormData({
          datePayement: new Date(datasPayement.attributes.datePayement),
          avanceMontant: 0,
          restePayement: 0,
          montantTotal: datasPayement.attributes.montantTotal,
          typePayement: datasPayement.attributes.typePayement,
        });

        if (datasPayement.attributes.typePayement === "Totalement-payé") {
          setdatePayementIs(true);
          setrefPayementIs(true);
          settypePayementIs(true);
        }

      }
      setRefPayement(datasPayement.attributes.refPayement);
    }

    const calculateTotalCost = (service) => {
      const quantity = parseInt(service.attributes.quantity);
      const unityPrice = parseInt(service.attributes.unityprice);
      return quantity * unityPrice;
    };

    // Calculate and set total cost for each service
    const updatedServices = datasPrestation.map((service) => {
      const totalCost = calculateTotalCost(service);
      return {
        ...service,
        attributes: {
          ...service.attributes,
          totalCost: totalCost,
        },
      };
    });

    setDatasPrestation(updatedServices);
  }, [datasCommande]);

  const overallTotalCost = datasPrestation.reduce((total, service) => {
    return total + service.attributes.totalCost;
  }, 0);

  useEffect(() => {
    setFormData((prevData) => {
      const newData = { ...prevData, montantTotal: overallTotalCost };
      return newData;
    });
  }, [overallTotalCost]);

  const handleAvanceChange = (value) => {
    const difference = FormData.montantTotal - value;

    setFormData((prevData) => ({
      ...prevData,
      avanceMontant: value,
      restePayement: difference >= 0 ? difference : 0,
    }));

    setError(difference <= 0 ? true : false);
  };

  const handleMontantTotalChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      montantTotal: value,
    }));
  };

  const submitButton = async () => {
    if (refPayement !== '') {
      InsertFacture(id, FormData, refPayement, close);
    }
  };

  const submitButtonUpdate = async () => {
    if (refPayement !== '') {
    UpdateFacture(datasPayement.id, FormData, refPayement, close);
    }
  };

  return (
    <>
      <Menu
        transitionProps={{ transition: "pop" }}
        withArrow
        position="bottom-end"
        withinPortal
      >
        <Menu.Target>
          <ActionIcon variant="subtle" color="gray">
            <IconDots />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item color="blue" >
            {" "}
            <Link
              style={{ textDecoration: "none", display: 'flex'}}
              to={{ pathname: `/facture/${id}` }}
            >
              <IconPrinter style={{ width: '20px', paddingRight: 10 }} /> <span>Imprimer la facture</span>
            </Link>
          </Menu.Item>
          <Menu.Item onClick={() => open()}>
            <div style={{ display: 'flex' }}>
              <IconCardsFilled style={{ width: '20px', paddingRight: 10 }} /> <span> Paiement</span>
            </div>
          </Menu.Item>
          {archive ? (
            <Menu.Item
              onClick={() =>
                DesarchiverCommandeConfirm(id, DesarchiverCommande)
              }
              color="green"
            >
              <div style={{ display: 'flex' }}>
              <IconFolderUp style={{ width: '20px', paddingRight: 10 }} /> <span>Desarchiver</span>
              </div>
            </Menu.Item>
          ) : (
            <Menu.Item
              onClick={() => ArchiverCommandeConfirm(id, ArchiverCommande)}
              color="yellow"
            >
              <div style={{ display: 'flex' }}>
              <IconArchive style={{ width: '20px', paddingRight: 10 }} /> <span>Archiver</span>
              </div>
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>

      <Modal
        opened={opened}
        onClose={close}
        centered
        title="Information sur le paiement"
        overlayProps={{
          backgroundopacity: 0.55,
          blur: 3,
        }}
      >
        <form onSubmit={(event) => event.preventDefault()}>
          <DatePickerInput
            dropdownType="modal"
            valueFormat="DD MMM YYYY"
            label="Date de paiement"
            placeholder="Sélectionnez une date"
            onChange={(e) =>
              setFormData((prevData) => {
                const newData = { ...prevData, datePayement: e };
                return newData;
              })
            }
            defaultValue={new Date(FormData.datePayement)}
            readOnly={datePayementIs === true}
          />
          <br />
          <TextInput
            label="Réfence du payement"
            placeholder="Preuve du payement"
            required
            onChange={(event) => setRefPayement(event.target.value)}
            value={refPayement}
            readOnly={refPayementIs === true}
          />
          <SimpleGrid cols={1} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
            <Select
              label="Payement"
              data={["Partiellement-payé", "Totalement-payé"]}
              onChange={(e) =>
                setFormData((prevData) => {
                  const newData = { ...prevData, typePayement: e };
                  return newData;
                })
              }
              value={FormData.typePayement}
              readOnly={typePayementIs === true}
            />
            {FormData.typePayement === "Partiellement-payé" && (
              <div>
                <NumberInput
                  hideControls
                  label="Montant de l'avance en Ar"
                  placeholder="Montant en Ariary"
                  required
                  onChange={(e) => handleAvanceChange(e)}
                  value={FormData.avanceMontant}
                />
                <NumberInput
                  hideControls
                  label="Reste à payé"
                  placeholder="Montant en Ariary"
                  required
                  value={FormData.restePayement}
                  readOnly
                  error={error === true}
                />
              </div>
            )}
          </SimpleGrid>

          <NumberInput
            hideControls
            label="Montant total en Ar"
            placeholder="Montant en Ariary"
            mt="md"
            required
            onChange={(e) =>
              setFormData((prevData) => {
                const newData = { ...prevData, montantTotal: e };
                return newData;
              })
            }
            value={FormData.montantTotal}
            readOnly
          />
          {datasPayement &&
            datasPayement.attributes.typePayement !== "Totalement-payé" && (
              <Group
                style={{ display: "flex", justifyContent: "space-between" }}
                mt="md"
              >
                <Button onClick={submitButtonUpdate} type="submit">
                  Sauvegarder
                </Button>
              </Group>
            )}
          {!datasPayement && (
            <Group
              style={{ display: "flex", justifyContent: "space-between" }}
              mt="md"
            >
              <Button onClick={submitButton} type="submit">
                Sauvegarder
              </Button>
            </Group>
          )}
        </form>
      </Modal>
    </>
  );
}
