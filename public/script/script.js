function goResult(){
    document.KSPayWeb.target = "";
    // document.KSPayWeb.action = "http://localhost:8888/kspay_result/";
    // document.KSPayWeb.submit();
    window.location.href = `/kspay_result/?rcid=${document.KSPayWeb.reCommConId.value}&point=${document.KSPayWeb.a.value}`
}
// eparamSet() - 함수설명 : 결재완료후 (kspay_wh_rcv.php로부터)결과값을 받아 지정된 결과페이지(kspay_wh_result.php)로 전송될 form에 세팅합니다.
function eparamSet(rcid, rctype, rhash){
    document.KSPayWeb.reCommConId.value 	= rcid;
    document.KSPayWeb.reCommType.value = rctype  ;
    document.KSPayWeb.reHash.value 	= rhash  ;
}
function mcancel()
{
    // 취소
    closeEvent();
}

function getLocalUrl(mypage)
{
    var myloc = location.href;
    return myloc.substring(0, myloc.lastIndexOf('/')).replaceAll('/kspay', '') + '/' + mypage;
}