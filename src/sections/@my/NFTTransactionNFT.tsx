// icons
// @mui
import useWallets from "../../hooks/useWallets";

// ----------------------------------------------------------------------
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {styled} from "@mui/material/styles";
import {CardActionArea, Pagination, Stack} from "@mui/material";
import {TableCellProps} from "@mui/material/TableCell/TableCell";
import {TableRowProps} from "@mui/material/TableRow/TableRow";

function createData(
    date: string,
    type: string,
    nft: string,
    price: string,
    chain: string,
    confirmation: string,
) {
    return {date, type, nft, price, chain, confirmation};
}

const rows = [
    createData('DATE', 'TYPE', 'NFT', 'PRICE', 'POLYGON', ''),
    createData('DATE', 'TYPE', 'NFT', 'PRICE', 'POLYGON', ''),
    createData('DATE', 'TYPE', 'NFT', 'PRICE', 'POLYGON', ''),
    createData('DATE', 'TYPE', 'NFT', 'PRICE', 'POLYGON', ''),
    createData('DATE', 'TYPE', 'NFT', 'PRICE', 'POLYGON', ''),
    createData('DATE', 'TYPE', 'NFT', 'PRICE', 'POLYGON', ''),
];


const HeaderTableCell = styled((props: TableCellProps) => (<TableCell  {...props}/>))(({theme}) => ({
    background: 'transparent',
    '&:first-child': {
        boxShadow: 'none'
    },
    '&:last-child': {
        boxShadow: 'none'
    }
}));

const BodyTableRow = styled((props: TableRowProps) => (<TableRow  {...props}/>))(({theme}) => ({
    backgroundColor: '#151515',
    borderRadius: 20,
    margin: '5px',
    // display: 'block',
    width: '100%'
}));

const BodyTableCell = styled((props: TableCellProps) => (<TableCell  {...props}/>))(({theme}) => ({
    background: 'transparent',
    '&:first-child': {
        boxShadow: 'none'
    },
    '&:last-child': {
        boxShadow: 'none'
    }
}));

export default function NFTTransactionNFT() {

    const {account} = useWallets();

    return <>
        <Stack spacing={3}>
            <Stack>
                <TableContainer component={Paper} sx={{background: 'transparent'}}>
                    <Table sx={{minWidth: 650, background: 'transparent'}} aria-label="simple table">
                        <TableHead sx={{background: 'transparent'}}>
                            <TableRow sx={{background: 'transparent', boxShadow: 'none'}}>
                                <HeaderTableCell>Date</HeaderTableCell>
                                <HeaderTableCell align="right">Type</HeaderTableCell>
                                <HeaderTableCell align="right">NFT</HeaderTableCell>
                                <HeaderTableCell align="right">Price</HeaderTableCell>
                                <HeaderTableCell align="right">Chain</HeaderTableCell>
                                <HeaderTableCell align="right">Confirmation</HeaderTableCell>
                                <HeaderTableCell align="right">-</HeaderTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <BodyTableRow
                                    key={row.confirmation}
                                >
                                    <BodyTableCell>{row.date}</BodyTableCell>
                                    <BodyTableCell align="right">{row.type}</BodyTableCell>
                                    <BodyTableCell align="right">{row.nft}</BodyTableCell>
                                    <BodyTableCell align="right">{row.price}</BodyTableCell>
                                    <BodyTableCell align="right">{row.chain}</BodyTableCell>
                                    <BodyTableCell align="right">{row.confirmation}</BodyTableCell>
                                    <BodyTableCell align="right">
                                        -
                                    </BodyTableCell>
                                </BodyTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </Stack>
            <Stack direction="row"
                   justifyContent="center"
                   alignItems="center">

                <Pagination count={4} variant="outlined" color="primary"/>
            </Stack>
        </Stack>
    </>
}
