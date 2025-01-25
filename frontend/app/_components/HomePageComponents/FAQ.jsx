"use client";
import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.05)",
          border: "1px solid #dcdcdc",
          borderRadius: "12px",
          marginBottom: "16px",
          padding: "0 12px",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            margin: 0,
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: "#fafafa",
          borderBottom: "1px solid #e0e0e0",
          padding: "12px 16px",
          "&.Mui-expanded": {
            backgroundColor: "#f0f0f0",
          },
        },
        content: {
          justifyContent: "flex-start",
          "&.Mui-expanded": {
            margin: "12px 0",
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          padding: "16px 16px 8px",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
          fontWeight: 500,
          textAlign: "left",
        },
      },
    },
  },
});

export default function AccordionUsage() {
  return (
    <ThemeProvider theme={theme}>
      <div className="container mx-auto p-4">
        <h2
          className="text-2xl font-bold mb-4 text-left ml-18"
          style={{ marginLeft: "4rem" }}
        >
          Frequently Asked Questions
        </h2>

        <div className="accordion-frame border-2 border-gray-300 p-8 rounded-lg hover:border-white transition-all duration-300 mx-8">
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography className="font-bold" style={{ textAlign: "left" }}>
                Do I need prior experience to take a course?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Many courses are beginner-friendly and don't require prior
                knowledge. Check the course description for prerequisites.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography className="font-bold" style={{ textAlign: "left" }}>
                How can I create an account?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Click on the Sign Up button at the top right corner of the
                homepage, enter your details, and follow the prompts to verify
                your email.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              <Typography className="font-bold" style={{ textAlign: "left" }}>
                Is there a limit to how many courses I can take?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                No, you can enroll in as many courses as you want.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4-content"
              id="panel4-header"
            >
              <Typography className="font-bold" style={{ textAlign: "left" }}>
                Can I access courses after completing them?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Yes, once you enroll in a course, you have lifetime access to
                the materials.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel5-content"
              id="panel5-header"
            >
              <Typography className="font-bold" style={{ textAlign: "left" }}>
                Will I receive the certificate at the end of the course?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Yes, you will receive a certificate at the end of the course and
                you will be able to add it to your LinkedIn profile or share it
                with your employer.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </ThemeProvider>
  );
}
