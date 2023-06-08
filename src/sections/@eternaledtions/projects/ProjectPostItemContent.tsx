import { m } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { Image, TextMaxLine } from 'src/components';
import { varHover, varTranHover } from 'src/components/animate';
import { useResponsive } from 'src/hooks';
import { SxProps } from '@mui/system';
import { ProjectTypes } from 'src/@types/project/projectTypes';

// ----------------------------------------------------------------------

type Props = {
  project: ProjectTypes | null;
  shouldHideDetail?: boolean;
  shouldHideCategory?: boolean;
  sx?: SxProps;
};

export default function ProjectPostItemContent({ project, shouldHideDetail, sx }: Props) {
  const theme = useTheme();
  const isMobile = useResponsive('down', 'md');

  if (!project) {
    return null;
  }

  const { title, thumbnail, categoriesStr, featured, curCollectionName } = project;

  return (
    <Stack
      component={m.div}
      whileHover="hover"
      variants={varHover(1)}
      transition={varTranHover()}
      sx={{
        borderRadius: {
          xs: 3,
          md: 5,
        },
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        ...sx,
      }}
    >
      <Box
        component={m.div}
        variants={varHover(1.25)}
        transition={varTranHover()}
        sx={{ position: 'relative' }}
      >
        <Image src={thumbnail} alt={title} ratio="3/4" sx={{ minHeight: 280 }} />
        <Box
          sx={{
            position: 'absolute',
            background: 'rgba(0, 0, 0, 0.2)',
            zIndex: 3,
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            // pointerEvents: 'none',
          }}
        />
      </Box>

      {!shouldHideDetail ? (
        <Stack
          justifyContent="flex-end"
          sx={{
            p: isMobile ? 2 : 3,
            height: 1,
            zIndex: 9,
            position: 'absolute',
            color: 'common.white',
          }}
        >
          <Stack spacing={0.25}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ opacity: 0.72, typography: 'caption' }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: 12,
                    md: 14,
                  },
                  lineHeight: 20 / 14,
                }}
              >
                {`@${featured?.company.name.en}`}
              </Typography>
            </Stack>

            <TextMaxLine
              sx={{
                fontSize: { xs: 24, md: 40 },
                lineHeight: {
                  xs: 28 / 24,
                  md: 44 / 40,
                },
                fontWeight: theme.typography.fontWeightBold,
              }}
            >
              {title}
            </TextMaxLine>
          </Stack>
        </Stack>
      ) : null}

      <Stack
        sx={{
          p: isMobile ? 2 : 3,
          height: 1,
          zIndex: 9,
          left: 0,
          position: 'absolute',
        }}
      >
        {curCollectionName && (
          <Chip
            label={curCollectionName}
            variant="outlined"
            color="primary"
            sx={{
              fontWeight: theme.typography.fontWeightBold,
            }}
          />
        )}
      </Stack>

      <Stack
        sx={{
          p: isMobile ? 2 : 3,
          height: 1,
          zIndex: 9,
          right: 0,
          position: 'absolute',
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
        }}
      >
        {categoriesStr && categoriesStr.split(',').length > 0
          ? categoriesStr.split(',').map((category: string, index) => (
              <Chip
                key={index}
                label={category.toUpperCase()}
                variant="outlined"
                sx={{
                  fontWeight: theme.typography.fontWeightBold,
                  color: theme.palette.common.white,
                }}
              />
            ))
          : null}
      </Stack>
    </Stack>
  );
}