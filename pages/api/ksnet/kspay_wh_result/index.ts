import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import iconv from 'iconv-lite';
import queryString from 'query-string';

const KSPAY_WEBHOST_URL = 'http://kspay.ksnet.to/store/KSPayWebV1.4/web_host/recv_post.jsp';
const DEFAULT_DELIM = '`';
const DEFAULT_RPARAMS =
  'authyn`trno`trddt`trdtm`amt`authno`msg1`msg2`ordno`isscd`aqucd`result`resultcd';
// authyn : O/X 상태
// trno   : KSNET거래번호(영수증 및 취소 등 결제데이터용 KEY
// trddt  : 거래일자(YYYYMMDD)
// trdtm  : 거래시간(hhmmss)
// amt    : 금액
// authno : 승인번호(신용카드:결제성공시), 에러코드(신용카드:승인거절시), 은행코드(가상계좌,계좌이체)
// ordno  : 주문번호
// isscd  : 발급사코드(신용카드), 가상계좌번호(가상계좌) ,기타결제수단의 경우 의미없음
// aqucd  : 매입사코드(신용카드)
// result : 승인구분
let payKey;
let typeStr;

async function kspay_send_msg(rcid: any, mType: any) {
  payKey = rcid;
  const msg = `sndCommConId=${payKey}&sndActionType=${mType}&sndRpyParams=${encodeURI(
    DEFAULT_RPARAMS
  )}`;
  const res: AxiosResponse = await axios.post(KSPAY_WEBHOST_URL, msg, {
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    responseType: 'arraybuffer',
  });
  const rslt = iconv.decode(res.data, 'EUC-KR');
  return rslt;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.method, req.body);
  const rcid = req.body.rcid;
  console.log('=====>00000', rcid);
  const rctype = req.body.reCommType;
  const rhash = req.body.reHash;

  //업체에서 추가하신 인자값을 받는 부분입니다
  const { a, b, c, d } = req.body;

  const ret = await kspay_send_msg(rcid, '1');
  console.log('=====>222222', ret);
  const msg = ret.split(DEFAULT_DELIM);
  res.status(200).send(msg);

  //   console.log('=====>', msg);
  //   const authyn = msg[1];
  //   const trno = msg[2];
  //   const trddt = msg[3];
  //   const trdtm = msg[4];
  //   const amt = msg[5];
  //   const authno = msg[6];
  //   const msg1 = msg[7];
  //   const msg2 = msg[8];
  //   const ordno = msg[9];
  //   const isscd = msg[10];
  //   const aqucd = msg[11];
  //   const result = msg[12];
  //   const resultcd = msg[13];
  //
  //   if (!result || 4 !== result.length) {
  //     typeStr = '(???)';
  //   } else {
  //     switch (result.charAt(0)) {
  //       case '1':
  //         typeStr = '신용카드';
  //         break;
  //       case 'I':
  //         typeStr = '신용카드';
  //         break;
  //       case '2':
  //         typeStr = '실시간계좌이체';
  //         break;
  //       case '6':
  //         typeStr = '가상계좌발급';
  //         break;
  //       case 'M':
  //         typeStr = '휴대폰결제';
  //         break;
  //       default:
  //         typeStr = '(????)';
  //         break;
  //     }
  //   }
  //   res.status(200).send(
  //     `
  // <html>
  // <head>
  // <meta http-equiv="Cache-Control" content="no-cache">
  // <meta http-equiv="Pragma" content="no-cache">
  // <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  // <title>*** KSNET WebHost 결과 [NEXTJS] ***</title>
  // <link href="http://kspay.ksnet.to/store/KSPayFlashV1.3/mall/css/pgstyle.css" rel="stylesheet" type="text/css" charset="euc-kr">
  // </head>
  //
  // <body>
  // <table width="560" border="0" cellspacing="0" cellpadding="0">
  //   <tr>
  //   <td height="50" align="right" background="/imgs/bg_top.gif" class="txt_pd1">KSNET WebHost 결과 [PHP]</td>
  //   </tr>
  //   <tr>
  //   <td height="530" valign="top" background="/imgs/bg_man.gif">
  //   <table width="560" border="0" cellspacing="0" cellpadding="0">
  //       <tr>
  //         <td width="25">&nbsp;</td>
  //         <td width="505" align="center">
  //     <table width="500" border="0" align="center" cellpadding="0" cellspacing="0">
  //       <tr>
  //       <td height="40" style="padding:0px 0px 0px 15px; "><img src="/imgs/ico_tit5.gif" width="30" height="30" align="absmiddle"> <strong>결과항목</strong></td>
  //       </tr>
  //       <tr>
  //         <td align="center"><table width="400" border="0" cellspacing="0" cellpadding="0">
  //           <tr bgcolor="#FFFFFF">
  //           <td width="120"><img src="/imgs/ico_right.gif" width="11" height="11" align="absmiddle"> 결제방법</td>
  //           <td width="280">${typeStr}</td></tr>
  //           <tr bgcolor="#E3E3E3"> <td height="1" colspan="2"></td> </tr>
  //
  //           <tr bgcolor="#FFFFFF">
  //             <td width="120"><img src="/imgs/ico_right.gif" width="11" height="11" align="absmiddle"> 성공여부</td>
  //             <td width="280">
  //     ${authyn} ${
  //       authyn === 'O' ? '승인성공' : '승인거절'
  //     }<font color=red> :성공여부값은 영어 대문자 O,X입니다. </font>
  //             </td>
  //           </tr>
  //           <tr bgcolor="#E3E3E3"> <td height="1" colspan="2"></td> </tr>
  //           <tr bgcolor="#FFFFFF">
  //             <td width="120"><img src="/imgs/ico_right.gif" width="11" height="11" align="absmiddle"> 응답코드</td>
  //             <td width="280">${resultcd}</td>
  //           </tr>
  //           <tr bgcolor="#E3E3E3"> <td height="1" colspan="2"></td> </tr>
  //           <tr bgcolor="#FFFFFF">
  //             <td width="120"><img src="/imgs/ico_right.gif" width="11" height="11" align="absmiddle"> 주문번호</td>
  //             <td width="280">${ordno}</td>
  //           </tr>
  //           <tr bgcolor="#E3E3E3"> <td height="1" colspan="2"></td> </tr>
  //           <tr bgcolor="#FFFFFF">
  //           <td width="120"><img src="/imgs/ico_right.gif" width="11" height="11" align="absmiddle"> 금액</td>
  //             <td width="280">${amt}</td>
  //           </tr>
  //           <tr bgcolor="#E3E3E3"> <td height="1" colspan="2"></td> </tr>
  //           <tr bgcolor="#FFFFFF">
  //             <td width="120"><img src="/imgs/ico_right.gif" width="11" height="11" align="absmiddle"> 거래번호</td>
  //             <td width="280">${trno} <font color=red>:KSNET에서 부여한 고유번호입니다. </font></td>
  //           </tr>
  //           <tr bgcolor="#E3E3E3"> <td height="1" colspan="2"></td> </tr>
  //           <tr bgcolor="#FFFFFF">
  //             <td width="120"><img src="/imgs/ico_right.gif" width="11" height="11" align="absmiddle"> 거래일자</td>
  //             <td width="280">${trddt}</td>
  //           </tr>
  //           <tr bgcolor="#E3E3E3"> <td height="1" colspan="2"></td> </tr>
  //           <tr bgcolor="#FFFFFF">
  //             <td width="120"><img src="/imgs/ico_right.gif" width="11" height="11" align="absmiddle"> 거래시간</td>
  //             <td width="280">${trdtm}</td>
  //           </tr>
  //           <tr bgcolor="#E3E3E3"> <td height="1" colspan="2"></td> </tr>
  // <?php if (!empty($authyn) && "O" == $authyn) { ?>
  //           <tr bgcolor="#FFFFFF">
  //             <td width="120"><img src="/imgs/ico_right.gif" width="11" height="11" align="absmiddle"> 카드사 승인번호/은행 코드번호</td>
  //             <td width="280">${authno}<font color=red>:카드사에서 부여한 번호로 고유한값은 아닙니다. </font></td>
  //           </tr>
  //           <tr bgcolor="#E3E3E3"> <td height="1" colspan="2"></td> </tr>
  // <?php } ?>
  //           <tr bgcolor="#FFFFFF">
  //             <td width="120"><img src="/imgs/ico_right.gif" width="11" height="11" align="absmiddle"> 발급사코드/가상계좌번호/계좌이체번호</td>
  //             <td width="280">${isscd}</td>
  //           </tr>
  //           <tr bgcolor="#E3E3E3"> <td height="1" colspan="2"></td> </tr>
  //           <tr bgcolor="#FFFFFF">
  //             <td width="120"><img src="/imgs/ico_right.gif" width="11" height="11" align="absmiddle"> 매입사코드</td>
  //             <td width="280">${aqucd}</td>
  //           </tr>
  //           <tr bgcolor="#E3E3E3"> <td height="1" colspan="2"></td> </tr>
  //           <tr bgcolor="#FFFFFF">
  //             <td width="120"><img src="/imgs/ico_right.gif" width="11" height="11" align="absmiddle"> 메시지1</td>
  //             <td width="280">${msg1}</td>
  //           </tr>
  //           <tr bgcolor="#E3E3E3"> <td height="1" colspan="2"></td> </tr>
  //           <tr bgcolor="#FFFFFF">
  //             <td width="120"><img src="/imgs/ico_right.gif" width="11" height="11" align="absmiddle"> 메시지2</td>
  //             <td width="280">${msg2}</td>
  //           </tr>
  //           <tr bgcolor="#E3E3E3"> <td height="1" colspan="2"></td> </tr>
  //         </table></td>
  //       </tr>
  //     </table>
  //     </td>
  //         <td width="30">&nbsp;</td>
  //       </tr>
  //     </table>
  //   </td>
  //   </tr>
  //   <tr>
  //   <td height="37" background="/imgs/bg_bot.gif">&nbsp;</td>
  //   </tr>
  // </table>
  // </body>
  // </html>
  //         `
  //   );
}
