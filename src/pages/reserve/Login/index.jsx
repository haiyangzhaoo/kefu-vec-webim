import React, { useCallback, useEffect, useState } from "react";
import intl from 'react-intl-universal'
import { Input, Toast } from 'antd-mobile'
import { Header, Body, VerCodeWrapper } from "./style"
import { sendCode, userLoginWithCode } from "@/assets/http/reserve"
import { setVisitorInfo } from "@/assets/storage/cookie";


export default function Login({tenantId, setShowLogin, setVisitorInfoState}) {
    const [phone, setPhone] = useState('')
    const [verCode, setVerCode] = useState('')
    const [codeText, setCodeText] = useState(intl.get('reserve_code'))
    const [canCode, setCanCode] = useState(true)
    const [timer, setTimer] = useState(null)

    const sendVerCode = async () => {
        if (canCode) {
            if (phone.length < 11) {
                Toast.show({
                    content: intl.get('reserve_phone_err'),
                    position: 'top',
                })
                return
            }

            await sendCode(tenantId, phone) // 请求数据，成功后倒计时

            let i = 60;
            let timerBak = setInterval(() => {
                if (i === 0) {
                    setCodeText(intl.get('reserve_recode'))
                    clearInterval(timerBak)
                    setTimer(null)
                    setCanCode(true)
                } else {
                    setCanCode(false)
                    setCodeText(intl.get('reserve_recode') + ('（' + i + '）'))
                    i--
                }
            }, 1000)
            setTimer(timerBak)
        }
    }

    const userLogin = async () => {
        if (phone.trim() && verCode.trim()) {
            const { entity } = await userLoginWithCode(tenantId, phone.trim(), verCode.trim()) // 请求接口，成功后回到设置登录状态，保存用户数据 
            setVisitorInfoState(entity)
            setVisitorInfo(tenantId, entity)
            setShowLogin(false)
        }
    }

    useEffect(() => {

        return () => {
            clearInterval(timer)
            setTimer(null)
        }
    }, [])

    return <React.Fragment>
        <Header>{intl.get('reserve_login_withMsg')}</Header>
        <Body>
            <Input
                value={phone}
                onChange={val => setPhone(val)}
                placeholder={intl.get('reserve_phone_placeholder')}
                minLength={11}
                maxLength={14}
            />
            <VerCodeWrapper canCode={canCode}>
                <Input
                    value={verCode}
                    onChange={val => setVerCode(val)}
                    placeholder={intl.get('reserve_code_placeholder')}
                />
                <div onClick={sendVerCode}>{codeText}</div>
            </VerCodeWrapper>
            <div onClick={userLogin}>{intl.get('reserve_login')}</div>
        </Body>
    </React.Fragment>
}
