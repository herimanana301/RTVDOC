import { createStyles,rem } from "@mantine/core";

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

export default useStyles