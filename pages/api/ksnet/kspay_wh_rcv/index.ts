import {NextApiRequest, NextApiResponse} from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // res.status(200).json({ message: 'Hello from Next.js!' });
    const {reCommConId, reCommType, reHash, reCnclType} = req.body;
    res.status(200).send(
        `
<title>KSPay(${reCommConId})</title>
<script language="JavaScript">
  function init()
  {
    if(${reCnclType} == "1")
    {
      if(opener == null)
      {
        parent.mcancel();
        return;
      }else{
        opener.mcancel();
        setTimeout("self.close()",2000);
        return;
      }
    }
    if(opener == null)
    {
      parent.eparamSet("${reCommConId}","${reCommType}","${reHash}");
      parent.goResult();
    }else
    {
      opener.eparamSet("${reCommConId}","${reCommType}","${reHash}");
      opener.goResult();
      setTimeout("self.close()",2000);
    }
  }
  init();
</script>
</head>
<body>
   <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0">
     <tr>
        <td valign="middle" align="center"><table width="280" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td><img src="/imgs/progress_resouce.jpg" width="280" height="201"></td>
          </tr>
        </table>    
    </td>
      </tr>
  </table>
</body>
</html>
        `
    )
}