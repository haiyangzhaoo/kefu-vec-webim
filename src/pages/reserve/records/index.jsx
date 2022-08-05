import React, { useEffect, useState } from "react"
import { Wrapper, Content, Item, Container, Cancel } from './style'
import { Modal, Toast } from 'antd-mobile'
import intl from 'react-intl-universal'
import { reserveList, cancelMask } from '@/assets/http/reserve'
import { useRecoilValue } from "recoil"
import { visitorInfoState } from "@/store/reserve"

export default function Records(props) {
    const [list, setList] = useState([])
    const visitorInfo = useRecoilValue(visitorInfoState(props.tenantId))
    const status = {
        CREATED: '待执行',
        EXECUTED: '已执行',
        CANCEL: '已取消'
    }

    const handleCancelButton = item => {
        Modal.alert({
            title: '提示',
            content: '取消后不可恢复，确定要取消预定吗？',
            showCloseButton: true,
            confirmText: '确定',
            onConfirm: () => handleCancel(item)
        })
    }

    const handleCancel = async item => {
        const { status } = await cancelMask({
            tenantId: props.tenantId,
            creatorId: visitorInfo.loginUser.userId,
            id: item.id,
            token: visitorInfo.token
        })
        if (status === 'OK') {
            Toast.show({
                content: intl.get('reserve_cancel_succ'),
                position: 'top',
            })
        }
    }

    const getList = async () => {
        const { entities } = await reserveList({
            tenantId: props.tenantId,
            creatorId: visitorInfo.loginUser.userId,
            token: visitorInfo.token
        })
        setList(entities)
    }

    useEffect(() => {
        getList()
    }, [])

    return <Wrapper>
        {list.map(item => (
            <Container key={item.id}>
                <Item>
                    <Content>预约人：{item.visitorName}</Content>
                    <Content>状态：{status[item.taskStatus]}</Content>
                </Item>
                <Item>
                    <Content>预约业务：{item.businessTypeName}</Content>
                </Item>
                <Item>
                    <Content>预约时间：{item.subscribeTimePeriod}</Content>
                    {item.taskStatus === 'CREATED' && <Cancel onClick={handleCancelButton.bind(this, item)}>取消</Cancel>}
                </Item>
                {/* <Item>
                    <Content>建议时间：{item.subscribeTimePeriod}</Content>
                </Item> */}
            </Container>
        ))}
    </Wrapper>
}
