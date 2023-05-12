import {
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  Accordion as MUIAccordion,
  Typography,
  accordionSummaryClasses,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { PropsWithChildren, ReactElement } from 'react';

interface Props {
  title: string | ReactElement;
  isExpanded: boolean;
  onChange: AccordionProps['onChange'];
}

export default function Accordion({
  title,
  children,
  isExpanded,
  onChange,
}: PropsWithChildren<Props>) {
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
          width: '100%',
          color: 'common.black',
          fontWeight: 700,
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
        {title}
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
        {typeof children === 'string' ? (
          <Typography
            sx={{ fontSize: '14px', color: 'common.black' }}
            dangerouslySetInnerHTML={{ __html: children }}
          />
        ) : (
          children
        )}
      </AccordionDetails>
    </MUIAccordion>
  );
}
