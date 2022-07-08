import React from "react"
import getToHost from '@/common/transfer'

export default function ReserveRecord() {
    const handleClose = () => {
        getToHost.send({event: 'closeChat'})
    }

    return <>
        <div>ReserveRecord</div>
        <div onClick={handleClose}>关闭</div>
    </>
}
