import { Grid, Skeleton, Container, Paper, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import urls from "../../services/urls";
import axios from "axios";

export default function General() {
  const [dataNumber, setDataNumber] = useState({
    clientNumber: 0,
    orderNumber: 0,
    personelNumber: 0,
  });
  const [invoice, setInvoice] = useState([]);
  const [totalTurnOver, setTotalTurnOver] = useState(0);
  useEffect(() => {
    axios.get(`${urls.StrapiUrl}api/clients?_limit=-1`).then((response) => {
      setDataNumber((prevData) => {
        return { ...prevData, clientNumber: response.data.data.length };
      });
    });
    axios.get(`${urls.StrapiUrl}api/commandes?_limit=-1`).then((response) => {
      setDataNumber((prevData) => {
        return { ...prevData, orderNumber: response.data.data.length };
      });
    });
    axios.get(`${urls.StrapiUrl}api/personnels?_limit=-1`).then((response) => {
      setDataNumber((prevData) => {
        return { ...prevData, personelNumber: response.data.data.length };
      });
    });
    axios.get(`${urls.StrapiUrl}api/payements?_limit=-1`).then((response) => {
      setInvoice(response.data.data);
    });
  }, []);
  useEffect(() => {
    if (invoice.length > 0) {
      console.log(invoice);
    }
  }, [invoice]);

  return (
    <Container my="md">
      <Grid>
        <Grid.Col xs={4}>
          <Paper
            shadow="xs"
            radius="xl"
            p="xl"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: "4rem" }}>{dataNumber.clientNumber}</Text>
            <Text>Nombre de client</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col xs={8}>
          {" "}
          <Paper
            shadow="xs"
            radius="xl"
            p="xl"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: "4rem" }}>{dataNumber.orderNumber}</Text>
            <Text>Nombre de commande</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col xs={5}>
          <Paper
            shadow="xs"
            radius="xl"
            p="xl"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: "4rem" }}>
              {dataNumber.personelNumber}
            </Text>
            <Text>Nombre de personnel</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col xs={13}>
          <Paper
            shadow="xs"
            radius="xl"
            p="xl"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>Chiffre d'affaire</Text>
            <Text style={{ fontSize: "4rem" }}></Text>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
