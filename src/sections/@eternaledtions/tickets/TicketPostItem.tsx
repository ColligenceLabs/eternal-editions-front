import {m} from 'framer-motion';
// next
import NextLink from 'next/link';
// @mui
import {styled} from '@mui/material/styles';
import {Avatar, Stack} from '@mui/material';
// routes
import Routes from '../../../routes';
// utils
import {fDate} from '../../../utils/formatTime';
// @types
// components
import {BgOverlay, Image, TextMaxLine} from '../../../components';
import {varHover, varTranHover} from '../../../components/animate';
import {TicketProps} from "../../../@types/ticket/ticket";

// ----------------------------------------------------------------------

const DotStyle = styled('span')(({theme}) => ({
    width: 4,
    height: 4,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
    margin: theme.spacing(0, 1),
}));

// ----------------------------------------------------------------------

type Props = {
    ticket: TicketProps;
};

export default function TicketPostItem({ticket}: Props) {
    const {slug, tokenId, content, title, background, subtitle,description, status, createdAt} = ticket;

    return (
        <Stack
            component={m.div}
            whileHover="hover"
            variants={varHover(1)}
            transition={varTranHover()}
            sx={{borderRadius: 2, overflow: 'hidden', position: 'relative'}}
        >

            <Avatar>TTT</Avatar>
            <m.div variants={varHover(1.25)} transition={varTranHover()}>
                <Image src={background} alt={title} ratio="6/4"/>
            </m.div>

            <Stack
                justifyContent="space-between"
                sx={{
                    p: 5,
                    height: 1,
                    zIndex: 9,
                    position: 'absolute',
                    color: 'common.white',
                }}
            >
                <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" sx={{opacity: 0.72, typography: 'caption'}}>
                        {fDate(createdAt)}
                        <DotStyle/>
                        {'duration'}
                    </Stack>

                    {/*
            href - 이동할 경로 혹은 URL. 유일한 필수 prop. (필수이기 때문에 href를 안 적으면 에러난다)
            as - 브라우저 URL 표시 줄에 표시 될 경로에 대한 선택적 데코레이터. Next.js 9.5.3 이전에는 동적 경로에 사용되었으므로 이전 문서 에서 작동 방식을 확인하길 바란다.
            passHref - href property를 Link 자식에게 강제로 전달하게 한다. 기본값은 false.
            prefetch - 백그라운드에서 페이지를 미리 가져온다. 기본값은 true. <Link /> 뷰 포트에 있는 모든 항목(초기에 혹은 스크롤을 통해)이 미리 로드 된다. prefetch={false}를 통해 프리페치를 비활성화할 수 있다. 정적 생성을 사용하는 페이지는 더 빠른 페이지 전환을 위해 데이터가 포함된 JSON파일을 미리 로드한다.
            replace - history 스택(방문 기록)에 새 url을 추가하는 대신 현재 상태를 변경한다. 기본값은 false
            scroll - 페이지 전환 후 페이지 상단으로 스크롤할지 여부. 기본값은 true.
            shallow - getStaticProps, getServerSideProps,  getInitialProps을 다시 실행하지 않고 현재 경로를 업데이트. 기본값은 false.
          */}
                    <NextLink
                        passHref
                        as={Routes.eternalEditions.ticket(slug)}
                        href={Routes.eternalEditions.ticket('[slug]')}
                    >
                        <TextMaxLine variant="h4" asLink>
                            {'티켓명'}
                        </TextMaxLine>
                    </NextLink>
                </Stack>

            </Stack>

            <BgOverlay direction="top"/>
        </Stack>
    );
}
