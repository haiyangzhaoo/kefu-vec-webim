import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Transfer() {
    const navigate = useNavigate();
    useEffect(() => {
        // window.location.href = '/?queueId=1&agentUserId=e64b1e2f-8cdc-4373-8e71-ca06fab770b5configId=0a3559ad-abda-4cc5-b6de-e1336c75904e&inviteeVisitorName=被邀请人名称&source=invitation'
    }, [])

    return <div>预约中间页面-参数{location.search}</div>
}
