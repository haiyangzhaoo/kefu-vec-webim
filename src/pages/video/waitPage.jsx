import React, { useState, useRef, useImperativeHandle, useCallback, useEffect } from "react";
import TimeControl from './comps/TimeControl'
import logo from '@/assets/img/qiye.png'
import intl from 'react-intl-universal'
import event from '@/tools/event'
import { WaitWrapper, WaitTitle, WaitAgent, WaitAgentLogo, WaitAgentDesc, WaitTip, WaitOpera, InviteOpera} from './style'
import { SYSTEM_RTCSESSION_INFO } from '@/assets/constants/events'
import { visitorClose, visitorWaiting } from '@/assets/http/user'

function AnswerButton({handleClick, desc, init = true}) {
    return <React.Fragment>
        <div>
            <span className={`icon-${init ? 'answer' : 'off'}`} onClick={handleClick}></span>
        </div>
        <div>{desc}</div>
    </React.Fragment>
}

export default React.forwardRef(function({step, compInfo, config, ws, setStep, params, callId, serviceAgora}, ref) {
    const [desc, setDesc] = useState(intl.get('startVideo'))
    const [tip, setTip] = useState(config.style.waitingPrompt)
    const [timer, setTimer] = useState(null)
    const [sessionInfo, setSessionInfo] = useState({})
    const [waitTimer, setWaitTimer] = useState(null) // 排队
    const [waitTimerFlag, setWaitTimerFlag] = useState('true')

    const stepRef = useRef()

    const callbackRecived = () => {
        ws.cancelVideo(null, {
            ext: {
                type: "agorartcmedia/video",
                targetSystem: 'kefurtc',
                msgtype: {
                    visitorAcceptInvitation : {
                        msg: "访客接受视频邀请"
                    }
                },
            },
        })
    }

    const callbackReject = () => {
        ws.cancelVideo(null, {
            ext: {
                type: "agorartcmedia/video",
                targetSystem: 'kefurtc',
                msgtype: {
                    visitorRejectInvitation : {
                        msg: "访访客拒绝视频邀请"
                    }
                },
            },
        })
        handleClose()
    }

    // 发起、重新发起
    function handleStart() {
        setStep('wait')
        setDesc(intl.get('closeVideo'))
        setTip(config.style.callingPrompt)

        setTimer(setTimeout(() => {
            var ext = {
                type: "agorartcmedia/video",
                targetSystem: 'kefurtc',
                msgtype: {
                    liveStreamInvitation: {
                        msg: intl.get('inviteAgentVideo'),
                        orgName: config.orgName,
                        appName: config.appName,
                        userName: config.user.username,
                        imServiceNumber: config.toUser,
                        restServer: config.restServer,
                        xmppServer: config.xmppServer,
                        resource: "webim",
                        isNewInvitation: true,
                        userAgent: navigator.userAgent,
                    },
                }
            }
            if (params.subscribe && JSON.parse(params.subscribe)) {
                ext.sessionExt = {
                    source: 'subscribe',
                    taskId: params.taskId || '',
                    queueId: Number(params.queueId) || 0
                }
            }
            ws.sendText(intl.get('inviteAgentVideo'), {
                ext
            })
        }, 1000))
    }

    // 结束 1.访客等待挂断 2.访客接通挂断 3.坐席拒接
    const handleClose = useCallback(e => {
        if (serviceAgora && !serviceAgora.remoteUsers.length) {
            // 坐席挂断
        } else {
            if (step === 'wait' && e && !e.agentReject) { // e: ws时是自定义消息，其他就是event
                ws.cancelVideo(callId, {
                    ext: {
                        type: "agorartcmedia/video",
                        targetSystem: 'kefurtc',
                        msgtype: {
                            visitorCancelInvitation : {
                                callId: callId
                            }
                        },
                    },
                })
            } else if (step === 'current') {
                visitorClose(sessionInfo.rtcSessionId)
            }
        }

        setStep('start')
        setDesc(intl.get('reStartVideo'))
        setTip(config.style.endingPrompt)
        // setCallId(null)
        // setTime(false)
        // setTicketIfo(null)
        // setSound(!config.switch.visitorCameraOff)
        // setFace(!config.switch.visitorCameraOff)
        // setSessionInfo({})
        // /* 重置白板信息 */
        // setWhiteboardUser(null);
        // setWhiteboardRoomInfo(null);
        // setWhiteboardVisible(false);
        // setChatVisible(false)

        // 本地离开
        serviceAgora && serviceAgora.leave();
        serviceAgora = null
    }, [sessionInfo, callId, step])

    useImperativeHandle(ref, () => ({
        handleClose
    }), [])

    // 会话信息&&排队
    const receiveRtcSession = sInfo => {
        setSessionInfo(sInfo)
        // callType  视频类型，呼入: 0，呼出: 1, 只有呼入才会调用查询排队人数接口
        if (sInfo.callType === 0) {
            setWaitTimer(setInterval(() => {
                getWaitData(sInfo.tenantId, sInfo.rtcSessionId)
            }, 3000))
        }
    }

    const getWaitData = (tenantId, ssid) => {
        visitorWaiting(tenantId, ssid).then(({entity: {waitingFlag, visitorWaitingNumber}}) => {
            stepRef.current.getAttribute('role') === 'wait' && setTip(visitorWaitingNumber)
            setWaitTimerFlag(waitingFlag)
        })
    }

    useEffect(() => {
        if (waitTimerFlag !== 'true') {
            clearInterval(waitTimer)
            setWaitTimerFlag('true')
        }
    }, [waitTimerFlag, waitTimer])

    useEffect(() => {
        event.on(SYSTEM_RTCSESSION_INFO, receiveRtcSession) // 会话信息，开始排队

        return () => {
            event.off(SYSTEM_RTCSESSION_INFO, receiveRtcSession)
        }
    }, [step])

    useEffect(() => {
        // 直接发起视频通话
        if (config.switch.skipWaitingPage) {
            handleStart()
        }

        return () => {
            clearTimeout(timer)
            clearTimeout(waitTimer)
        }
    }, [])

    var waitTitle = step === 'invite' ? intl.get('inviteTitle') : intl.get('ptitle')
    var tenantLogo = logo // 头像含有域名展示不出来
    if (compInfo.avatar) {
        tenantLogo = compInfo.avatar.indexOf('//') > -1 ? '/' + compInfo.avatar.split('/').slice(3).join('/') : compInfo.avatar
    }

    return <WaitWrapper className={!['enquiry', 'current'].includes(step) ? '' : 'hide'}>
        <WaitTitle>
            <h2>{waitTitle}</h2>
        </WaitTitle>
        <WaitAgent>
            {step === 'invite' && <TimeControl />}
            <WaitAgentLogo>
                <img src={tenantLogo}  />
            </WaitAgentLogo>
            <WaitAgentDesc>
                {compInfo.name ? compInfo.name : ''}
            </WaitAgentDesc>
        </WaitAgent>
        <WaitTip>{tip}</WaitTip>
        {step === 'invite' ? (
            <InviteOpera>
                <div className='recive'>
                    <AnswerButton
                        handleClick={callbackRecived}
                        desc={intl.get('reciveVideo')}/>
                </div>
                <div className='hung'>
                    <AnswerButton
                        handleClick={callbackReject}
                        desc={intl.get('closeVideo')}
                        init={false}/>
                </div>
            </InviteOpera>
        ) : (
            <WaitOpera role={step} ref={stepRef}>
                {step === 'start' ? <AnswerButton handleClick={handleStart} desc={desc} /> : <AnswerButton handleClick={handleClose} desc={desc} init={false} />}
            </WaitOpera>
        )}
    </WaitWrapper>
})