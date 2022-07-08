import React from "react"
import getToHost from '@/common/transfer'

export default function Reserve() {
    const handleClose = () => {
        getToHost.send({event: 'closeChat'})
    }

    return <>
        <div>reserve</div>
        <div onClick={handleClose}>关闭</div>
    </>
}
