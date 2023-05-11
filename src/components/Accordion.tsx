import {
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  Accordion as MUIAccordion,
  Typography,
  accordionSummaryClasses,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';

interface Props {
  title: string;
  content: string;
  isExpanded: boolean;
  onChange: AccordionProps['onChange'];
}

export default function Accordion({ title, content, isExpanded, onChange }: Props) {
  return (
    <MUIAccordion
      expanded={isExpanded}
      onChange={onChange}
      sx={{
        background: '#FFFFFF',
      }}
    >
      <AccordionSummary
        sx={{
          padding: {
            xs: '16px',
            md: '24px',
          },
          [`.${accordionSummaryClasses.content}`]: {
            margin: 0,
          },
          [`.${accordionSummaryClasses.content}.Mui-expanded`]: {
            margin: 0,
          },
        }}
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Typography
          sx={{
            width: '100%',
            color: 'common.black',
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          padding: {
            xs: '16px',
            md: '24px',
          },
          paddingTop: {
            xs: 0,
            md: 0,
          },
        }}
      >
        <Typography sx={{ fontSize: '14px', color: 'common.black' }}>{content}</Typography>
      </AccordionDetails>
    </MUIAccordion>
  );
}
