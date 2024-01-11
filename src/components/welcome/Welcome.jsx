import { Title, Text, Button, Container } from "@mantine/core";
import { Dots } from "./Dots";
import classes from "./WelcomeText.module.css";
export function Welcome({ setActive }) {
  return (
    <Container className={classes.wrapper} size={1400}>
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Bienvenue sur{" "}
          <Text component="span" className={classes.highlight} inherit>
            RTVDOC
          </Text>{" "}
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" c="dimmed" className={classes.description}>
            Cette application vous permet de gérer la partie RH, Bon de
            commande, Facture et Clients
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button
            className={classes.control}
            size="lg"
            onClick={() => {
              setActive("Général");
              localStorage.setItem("firstConnex", "true");
            }}
          >
            Démarrer
          </Button>
        </div>
      </div>
    </Container>
  );
}
