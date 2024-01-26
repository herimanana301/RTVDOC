import {
  Grid,
  Accordion,
  Container,
  Paper,
  Title,
  Text,
  Flex,
} from "@mantine/core";
import { MonthPicker, YearPicker } from "@mantine/dates";
import { useEffect, useState } from "react";
import urls from "../../services/urls";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { IconPlus } from "@tabler/icons-react";
export default function General() {
  const [dataNumber, setDataNumber] = useState({
    clientNumber: 0,
    orderNumber: 0,
    personelNumber: 0,
  });
  // Données de paiement
  const [paymentData, setPaymentData] = useState([]);
  const [colors, setColors] = useState([
    "#F72577",
    "#3DA5DA",
    "#FBC02D",
    "#8C7166",
    "#2DC99F",
  ]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectMonth, setSelectMonth] = useState(new Date().getMonth());

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
    axios
      .get(`${urls.StrapiUrl}api/payements?populate=commande.client`)
      .then((response) => {
        setPaymentData(response.data.data);
      });
  }, []);

  const filteredData = paymentData.map((payment) => ({
    nomclient:
      payment.attributes.commande.data.attributes.client.data.attributes
        .raisonsocial,
    montantTotal: payment.attributes.montantTotal,
    datePayement: payment.attributes.datePayement,
  }));
  const clientDataperMonth = () => {
    if (filteredData) {
      let clientList = [];
      filteredData.forEach((data) => {
        if (!clientList.includes(data.nomclient)) {
          clientList.push(data.nomclient);
        }
      }); // clientList est la liste des noms de clients

      let monthlyTotal = Array.from({ length: 12 }).fill(0);
      clientList.forEach((client) => {
        const totalInvoice = (month) => {
          if (
            filteredData.filter(
              (data) =>
                data.nomclient === client &&
                new Date(data.datePayement).getMonth() === month
            ).length > 1
          ) {
            return filteredData
              .filter(
                (data) =>
                  data.nomclient === client &&
                  new Date(data.datePayement).getMonth() === month
              )
              .reduce(
                (sum, current) => sum.montantTotal + current.montantTotal
              );
          } else {
            return filteredData.filter(
              (data) =>
                data.nomclient === client &&
                new Date(data.datePayement).getMonth() === month
            )[0].montantTotal;
          }
        }; // cette partie calcul tout en totalité sans considérer le mois

        const invoiceMonths = filteredData
          .filter((data) => data.nomclient === client)
          .map((months) => new Date(months.datePayement).getMonth())
          .sort((a, b) => a - b);

        invoiceMonths.forEach((month) => {
          if (monthlyTotal[month] === 0) {
            monthlyTotal[month] = [
              {
                client: client,
                monthtotal: totalInvoice(month),
              },
            ];
          } else {
            monthlyTotal[month] = [
              ...monthlyTotal[month],
              {
                client: client,
                monthtotal: totalInvoice(month),
              },
            ];
          }
        });
      });
      return monthlyTotal;
    }
  };

  // Function to calculate sum of 'montantTotal' for each month
  const calculateMonthlyTotal = () => {
    const monthlyTotal = Array.from({ length: 12 }).fill(0); // Initialize array to hold monthly totals

    // Iterate through payment data and sum 'montantTotal' for each month
    paymentData.forEach((payment) => {
      const month = new Date(payment.attributes.datePayement).getMonth(); // Get month index (0 - 11)
      monthlyTotal[month] += payment.attributes.montantTotal; // Add 'montantTotal' to corresponding month
    });

    return monthlyTotal;
  };

  const restOfClient = () => {
    const uniqueClients = new Set();

    const transformedData = paymentData
      .map((payment) => {
        const clientName =
          payment.attributes.commande.data.attributes.client.data.attributes
            .raisonsocial;

        if (!uniqueClients.has(clientName)) {
          uniqueClients.add(clientName);

          return { [clientName]: 0 };
        }
        return null;
      })
      .filter(Boolean)
      .reduce((acc, obj) => Object.assign(acc, obj), {});
    return transformedData;
  };

  const setDifference = (setA, setB) => {
    const difference = new Set(setA);
    for (const item of setB) {
      difference.delete(item);
    }
    return difference;
  };
  // Data for the line chart
  const chartData = Array.from({ length: 12 }).map((_, index) => {
    const month = new Date(0, index).toLocaleString("default", {
      month: "long",
    });
    const montantTotal = calculateMonthlyTotal()[index];
    const formattedData = () => {
      if (clientDataperMonth()[index] === 0) {
        return restOfClient();
      } else {
        return clientDataperMonth()[index].reduce(
          (acc, { client, monthtotal }) => {
            acc[client] = monthtotal;
            return acc;
          },
          {}
        );
      }
    };
    return {
      month: month,
      montantTotal: montantTotal,
      ...formattedData(),
    };
  });

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

        <Grid.Col xs={14}>
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
            <Title order={1} style={{ marginTop: "2em" }} id="TitreChart">
              Vue d'ensemble des chiffres d'affaires
            </Title>

            <LineChart
              width={900}
              height={400}
              data={chartData}
              style={{ margin: "2em auto" }}
            >
              <Line type="monotone" dataKey="montantTotal" stroke="#8884d8" />
              {Object.keys(chartData[0]).map((step) => {
                if (step != "montantTotal" && step != "month") {
                  return (
                    <Line
                      key={step}
                      type="monotone"
                      dataKey={step}
                      stroke={colors[Math.floor(Math.random() * colors.length)]}
                    />
                  );
                }
              })}
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
            </LineChart>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
