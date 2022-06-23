import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Wrapper, WaitWrapper, WaitTitle, WaitAgent, WaitAgentLogo, WaitAgentDesc, WaitTip, WaitOpera, CurrentWrapper, CurrentTitle, CurrentFooter, CurrentBodySelf, CurrentBodyMicro, CurrentBodyMore, TopVideoBox, CurrentVideo, InviteOpera, DefaultConnect, RoomWhite, RoomControllerBox, RoomControllerMidBox, PagePreviewCell } from './style'
import TimeControl from './comps/TimeControl'
import videoChatAgora from '@/tools/hxVideo'
import logo from '@/assets/img/qiye.png'
import commonConfig from '@/common/config'
import event from '@/tools/event'
import { visitorClose, getOfficalAccounts } from '@/assets/http/user'
import { SYSTEM_VIDEO_TICKET_RECEIVED, SYSTEM_VIDEO_ARGO_END, SYSTEM_VIDEO_ARGO_REJECT, SYSTEM_VIDEO_CALLBACK_TICKET, SYSTEM_WHITE_BOARD_RECEIVED } from '@/assets/constants/events'
// import profile from '@/tools/profile'
import MediaPlayer from './comps/MediaPlayer/MediaPlayer'
import getToHost from '@/common/transfer'
import intl from 'react-intl-universal'
import utils from '@/tools/utils'
import queryString from 'query-string'
import { useFastboard, Fastboard } from "@netless/fastboard-react"
import { createPortal } from 'react-dom'
import WhiteboardPlayer from './comps/WhiteboardPlayer'
import exitSvg from '@/assets/img/exit.svg'
import imageSvg from '@/assets/img/image.svg'
import videoSvg from '@/assets/img/video.svg'
import audioSvg from '@/assets/img/audio.svg'
import VecModal from '@/components/Modal'
import Upload from 'rc-upload'
import Enquiry from './comps/Enquiry'

import ws from '@/ws'

var serviceAgora = null
var top = window.top === window.self // false 在iframe里面 true不在
var config = commonConfig.getConfig()
var params = queryString.parse(location.search)
var hideDefault = params.hideDefaultButton || false
if (!top && params.hideDefaultButton === undefined) {
    hideDefault = false
}

// 沙箱打开vconsole
if (window.location.origin.indexOf('localhost') > -1 || window.location.origin.indexOf('sandbox') > -1) {
    import('vconsole').then(({default: VConsole }) => {
        new VConsole()
    })
}

export default function Video() {
    const [step, setStep] = useState(config.switch.skipWaitingPage ? 'wait' : 'enquiry') // start: 发起和重新发起 wait等待接听中 current 视频中 invite:客服邀请 enquiry: 评价
    const [desc, setDesc] = useState(intl.get('startVideo'))
    const [tip, setTip] = useState(config.style.waitingPrompt)
    const [sound, setSound] = useState(!config.switch.visitorCameraOff) // 开关声音
    const [face, setFace] = useState(!config.switch.visitorCameraOff) // 开关视频
    const [time, setTime] = useState(false) // 开始计时
    const [compInfo, setCompInfo] = useState({
        name: config.tenantInfo.name,
        avatar: config.tenantInfo.avatar,
    })
    const [ localUser, setLocalUser ] = useState(null); // 本地用户音视频轨道保存
    const [ currentChooseUser, setCurrentChooseUser ] = useState(null); // 当前在正中央播放的用户

    const [callId, setCallId] = useState(null)
    const [remoteUsers, setRemoteUsers] = useState([])
    const [ticketInfo, setTicketIfo] = useState(null)
    const [idNameMap, setIdNameMap] = useState({})
    const [agents, setAgents] = useState({})
    const [ssid, setSsid] = useState('')
    const [timer, setTimer] = useState(null)
    const [show, setShow] = useState(top ? true : false)
    const [hideDefaultButton, setHideDefaultButton] = useState(hideDefault)
    const [whiteboardUser, setWhiteboardUser] = useState(null);
    const [whiteboardVisible, setWhiteboardVisible] = useState(false);
    const [whiteboardRoomInfo, setWhiteboardRoomInfo] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    let [ callingScreenSwitch, setCallingScreenSwitch ] = useState(false);

    const videoRef = useRef();
    const stepRef = useRef()

    // 发起、重新发起
    function handleStart() {
        setStep('wait')
        setDesc(intl.get('closeVideo'))
        setTip(config.style.callingPrompt)

        setTimer(setTimeout(() => {
            ws.sendText(intl.get('inviteAgentVideo'), {
                ext: {
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
                    },
                },
            })
        }, 1000))
    }

    // 接受视频
    const recived = async ticketInfo => {
        if (!serviceAgora) {
            setTicketIfo(ticketInfo)

            var cfgAgora = {
                appid: ticketInfo.appId,
                channel: ticketInfo.channel,
                token: ticketInfo.token,
                uid: ticketInfo.uid
            }
            // callId 拒绝视频邀请要用
            setCallId(ticketInfo.callId)
            setSsid(ticketInfo.ssid)

            serviceAgora = new videoChatAgora({
                onErrorNotify,
                onRemoteUserChange,
                onUserLeft
            })
            // 获取访客信息 关闭信息的时候要用 后续不掉用关闭接口可以去除
            const officialAccountList = await getOfficalAccounts()
            if (officialAccountList.length >= 0) {
                await serviceAgora.join(cfgAgora)
                setTime(true) // 开始计时
                setStep('current')

                serviceAgora.localAudioTrack.setMuted(config.switch.visitorCameraOff)
                serviceAgora.localVideoTrack.setMuted(config.switch.visitorCameraOff)
                config.switch.visitorCameraOff && serviceAgora.closeLocalTrack('video')

                let { localAudioTrack, localVideoTrack } = serviceAgora
                let localUser = {
                    isLocal: true, 
                    // audioTrack: localAudioTrack,
                    videoTrack: config.switch.visitorCameraOff ? null : localVideoTrack,
                    uid: cfgAgora.uid
                }

                setLocalUser(localUser);
                setCurrentChooseUser(localUser);
            } else {
                noVisitorClose()
            }
        }

        // setAgents(agentsOld => {
        //     return Object.assign({}, agentsOld, {[ticketInfo.agentTicket.uid]: ticketInfo.agentTicket})
        // })
        setIdNameMap(val => Object.assign({}, val, {[ticketInfo.agentTicket.uid]: ticketInfo.agentTicket.trueName}))
    }

    // 接受白板
    const receiveWhiteBoard = roomInfo => {
        setWhiteboardRoomInfo(roomInfo)
        setWhiteboardVisible(true)
    }

    /*打开白版 */
    const showWhiteboard = () => {
        let user = {
            isWhiteboard: true,
            uid: String(Math.ceil(Math.random() * 1000))
        };
        setWhiteboardUser(user)
        setCurrentChooseUser(user);
    }

    // 无访客信息直接挂断，否则关闭需要的信息获取不到
    const noVisitorClose = () => {
        setStep('start')
        setDesc(intl.get('reStartVideo'))
        setTip(config.style.endingPrompt)
        setCallId(null)

        // 本地离开
        serviceAgora && serviceAgora.leave();
        serviceAgora = null
    }

    // 结束 1.访客等待挂断 2.访客接通挂断 3.坐席拒接
    const handleClose = useCallback(e => {
        if (step === 'wait' && e && !e.agentReject) {
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
            visitorClose(ssid)
        }

        setStep('start')
        setDesc(intl.get('reStartVideo'))
        setTip(config.style.endingPrompt)
        setCallId(null)
        setTime(false)
        setTicketIfo(null)
        setSound(!config.switch.visitorCameraOff)
        setFace(!config.switch.visitorCameraOff)
        setSsid('')
        /* 重置白板信息 */
        setWhiteboardUser(null);
        setWhiteboardRoomInfo(null);
        setWhiteboardVisible(false);

        // 本地离开
        serviceAgora && serviceAgora.leave();
        serviceAgora = null
    }, [ssid, callId, step])

    // 声音
    function handleSound() {
        setSound(!sound)
        serviceAgora.localAudioTrack.setMuted(sound); // false 打开 true 关闭
    }

    const handleFace = async () => {
        if (callingScreenSwitch) return onDesktopControl();

        if (serviceAgora.localVideoTrack) {
            serviceAgora.closeLocalTrack('video')
            setLocalUser(user => {
                user.videoTrack = null
                return user
            })
        } else {
            const localVideoTrack = await serviceAgora.createLocalVideoTrack()
            serviceAgora.publish(localVideoTrack)
            setLocalUser(user => {
                user.videoTrack = localVideoTrack
                return user
            })
            currentChooseUser.uid === localUser.uid && localVideoTrack.play(videoRef.current)
        }
        // serviceAgora.localVideoTrack.setMuted(face); // false 打开 true 关闭
        setFace(!face)
    }

    const onRemoteUserChange = useCallback((remoteUsers) => {
        setRemoteUsers(remoteUsers);
    }, []);

    // 客服没接 visitorCancelInvitation 接通后就是 visitorRejectInvitation
    const onUserLeft = useCallback(user => {
        if (!serviceAgora) return

        if (!serviceAgora.remoteUsers.length) {
            serviceAgora.leave()
            serviceAgora = null
            setStep('start')
            setDesc(intl.get('reStartVideo'))
            setTip(config.style.endingPrompt)
            setCallId(null)
            setTime(false)
            setTicketIfo(null)
            setSound(!config.switch.visitorCameraOff)
            setFace(!config.switch.visitorCameraOff)
        } else {
            let _remoteUsers = serviceAgora.remoteUsers || [];
            if (currentChooseUser && user === currentChooseUser && !!_remoteUsers.length && (_remoteUsers[0] !== user)) {
                setCurrentChooseUser(_remoteUsers[0]);
            }
        }
    }, [currentChooseUser, remoteUsers])

    const onUserJoined = useCallback((user) => {
        !!whiteboardRoomInfo && sendWhiteboardInvitation();
    }, [whiteboardRoomInfo]);

    /* 发送白板邀请 */
    const sendWhiteboardInvitation = useCallback(() => {
        ws.cancelVideo(callId, {
            ext: {
                type: "agorartcmedia/video",
                targetSystem: 'kefurtc',
                msgtype: {
                    whiteboardInvitaion:{
                        callId: callId
                    }
                },
            },
        });
    }, [callId])

    /* 通话中打开白板 */
    const bindWhiteboardClick = useCallback(_.debounce(async () => {
        if (whiteboardVisible) {
            return setWhiteboardVisible(false); // 关闭白版
        } else {
            sendWhiteboardInvitation(); 
        }
    }, 1000), [whiteboardVisible]);

    function onErrorNotify(errorCode) {
        let errorCodeMap = {
            NOT_READABLE: '请检查摄像头/麦克风，或者屏幕分享权限！请刷新浏览器重试！',
            PERMISSION_DENIED: '请检查摄像头/麦克风，或者屏幕分享权限！',
            INVALID_REMOTE_USER: '非法的远端用户，可能是远端用户不在频道内或还未发布任何媒体轨道。',
            UNEXPECTED_RESPONSE: '等待网络稳定后重试该操作。',
            NOT_SUPPORTED: '浏览器不支持。建议使用谷歌浏览器',
            INVALID_PARAMS: '非法参数',
            INVALID_OPERATION: '非法操作，通常是因为在当前状态不能进行该操作。',
            OPERATION_ABORTED: 'OPERATION_ABORTED 操作中止，通常是因为网络质量差或连接断开导致与 Agora 服务器通信失败。',
            NO_ACTIVE_STATUS: ' Agora 项目未激活或被禁用',
            UID_CONFLICT: ' 同一个频道内 UID 重复。',
            INVALID_UINT_UID_FROM_STRING_UID: 'String UID 分配服务返回了非法的 int UID。',
            DEVICE_NOT_FOUND: "设备未找到，请检查设备"
        }
    
        errorCodeMap[errorCode] && console.error(errorCodeMap[errorCode])
    }

    // iframe最小化
    const handleMini = () => {
        getToHost.send({event: 'closeChat'})
        setShow(false)
    }

    // 坐席回呼
    const agentCallback = ticketInfo => {
        setTicketIfo(ticketInfo)
        setStep('invite')
        setTip('客服正在邀请您进行视频通话')
    }

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
        recived(ticketInfo)
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

    // 默认联系客服
    const handleConnect = () => {
        getToHost.send({event: 'showChat'})
        setShow(true)
    }

    // 白板Modal
    const handleWhiteOk = () => {
        setWhiteboardVisible(false)
        setIsModalVisible(false)
    }

    const handleWhiteCancel = () => {
        setIsModalVisible(false)
    }

    /* 桌面分享绑定事件 */
    const onDesktopControl = _.debounce(function() {
        if (whiteboardVisible) return;
        let _hxAgoraVideo = serviceAgora

        if (callingScreenSwitch) {
            setFace(true);
            setCallingScreenSwitch(false);
            _hxAgoraVideo.client.unpublish(_hxAgoraVideo.localScreenTrack);
            _hxAgoraVideo.localScreenTrack?.off('track-ended')
            _hxAgoraVideo.closeLocalTrack('screen'); //关闭屏幕分享

            _hxAgoraVideo.publish(_hxAgoraVideo.localVideoTrack);
            _hxAgoraVideo.localVideoTrack.setMuted(false);
            let user = { ...localUser, videoTrack:  _hxAgoraVideo.localVideoTrack };
            setLocalUser(user);
            currentChooseUser.isLocal && setCurrentChooseUser(user);
        } else {
            _hxAgoraVideo.createScreenVideoTrack()
            .then((localScreenTrack) => {
                if (!localScreenTrack) return;
                setCallingScreenSwitch(true);
                setFace(false);

                _hxAgoraVideo.client.unpublish(_hxAgoraVideo.localVideoTrack);
                _hxAgoraVideo.localVideoTrack.stop();
                _hxAgoraVideo.publish(localScreenTrack);
                let user = { ...localUser, videoTrack:  localScreenTrack };
                setLocalUser(user);
                currentChooseUser.isLocal && setCurrentChooseUser(user);
            })
        }
    }, 1000);

    useEffect(() => {
        if (!serviceAgora?.localScreenTrack) return;

        /* 用户通过浏览器提供的关系屏幕共享按钮 */
        serviceAgora.localScreenTrack.removeAllListeners('track-ended')
        serviceAgora.localScreenTrack.on('track-ended', onDesktopControl)
    }, [callingScreenSwitch]);

    useEffect(() => {
        if (!serviceAgora?.client) return;
    
        serviceAgora.client.on('user-left', onUserLeft);
        return () => void serviceAgora?.client?.off('user-left', onUserLeft);
    }, [onUserLeft]);

    useEffect(() => {
        if (!serviceAgora?.client) return;

        serviceAgora.client.on('user-joined', onUserJoined);
        return () => void serviceAgora?.client?.off('user-joined', onUserJoined);
    }, [onUserJoined]);

    useEffect(() => {
        // 客服在中心
        if (remoteUsers.length) {
            var agentAll = remoteUsers.filter(({uid}) => uid !== localUser.uid)
            agentAll.length && setCurrentChooseUser(agentAll[0])
        }

        if (remoteUsers.length && !currentChooseUser.isLocal) {
            currentChooseUser?.videoTrack?.play(videoRef.current, {fit: "contain"});
            currentChooseUser?.audioTrack?.play();
        }
    }, [remoteUsers])

    useEffect(() => {
        if (currentChooseUser?.isWhiteboard && whiteboardVisible) {
            setWhiteboardRoomInfo((val) => ({ ...val, domNode: videoRef.current }));
        }

        if (!videoRef.current) return;
    
        currentChooseUser?.audioTrack?.play();
        currentChooseUser?.videoTrack?.play(videoRef.current, !currentChooseUser.isLocal ? {fit: "contain"} : null); //本地播放视频
    }, [currentChooseUser, whiteboardVisible])

    useEffect(() => {
        if (stepRef.current.getAttribute('role') !== 'current') return;

        if (whiteboardVisible) { //打开
            showWhiteboard();
        } else { //关闭
            setWhiteboardRoomInfo(null);
            setWhiteboardUser(null);
            if (currentChooseUser?.isWhiteboard) {
                setCurrentChooseUser(remoteUsers[0] || localUser);
            }
        }
    }, [whiteboardVisible])

    useEffect(() => {
        event.on(SYSTEM_VIDEO_TICKET_RECEIVED, recived) // 监听接受
        event.on(SYSTEM_VIDEO_ARGO_END, handleClose) // 取消和挂断
        event.on(SYSTEM_VIDEO_ARGO_REJECT, handleClose) // 坐席拒接
        event.on(SYSTEM_VIDEO_CALLBACK_TICKET, agentCallback) // 坐席回呼
        event.on(SYSTEM_WHITE_BOARD_RECEIVED, receiveWhiteBoard) // 白板

        return () => {
            event.off(SYSTEM_VIDEO_TICKET_RECEIVED, recived) // 监听接受
            event.off(SYSTEM_VIDEO_ARGO_END, handleClose) // 取消和挂断
            event.off(SYSTEM_VIDEO_ARGO_REJECT, handleClose) // 坐席拒接
            event.off(SYSTEM_VIDEO_CALLBACK_TICKET, agentCallback)
            event.off(SYSTEM_WHITE_BOARD_RECEIVED, receiveWhiteBoard) // 白板
        }
    }, [step])

    useEffect(() => {
        // 直接发起视频通话
        if (config.switch.skipWaitingPage) {
            handleStart()
        }

        return () => {
            clearTimeout(timer)
        }
    }, [])

    const App = useCallback(() => {
        const fastboard = useFastboard(() => ({
            sdkConfig: {
                appIdentifier: whiteboardRoomInfo.appIdentifier,
                region: "cn-hz", // "cn-hz" | "us-sv" | "sg" | "in-mum" | "gb-lon"
            },
            joinRoom: {
                uid: whiteboardUser && whiteboardUser.uid || Math.ceil(Math.random() * 1000) + '',
                uuid: whiteboardRoomInfo.roomUUID,
                roomToken: whiteboardRoomInfo.roomToken,
            },
        }));

        const [uiConfig] = useState(() => ({
            page_control: { enable: true },
            redo_undo: { enable: true },
            toolbar: { enable: true },
            zoom_control: { enable: true }
        }));

        // return <Fastboard app={fastboard} language="en" theme="light" config={uiConfig} />

        return createPortal(<RoomWhite>
            <Fastboard app={fastboard} language="en" theme="light" config={uiConfig} />
            <RoomControllerBox>
                <RoomControllerMidBox>
                    <PagePreviewCell title={intl.get('upload_img')}>
                        <Upload 
                            action={`/v1/agorartc/tenant/${config.tenantId}/whiteboard/call/${callId}/conversion/upload`}
                            multiple={true}
                            onStart={file => console.log('onStart', file, file.name)}
                            onSuccess={ret => fastboard.insertImage(ret.entity)}
                            onError={err => console.log('onError', err)}
                        >
                            <img src={imageSvg} />
                        </Upload>
                    </PagePreviewCell>
                    <PagePreviewCell title={intl.get('upload_video')}>
                        <Upload
                            action={`/v1/agorartc/tenant/${config.tenantId}/whiteboard/call/${callId}/conversion/upload`}
                            multiple={true}
                            accept=".mp4"
                            onStart={file => console.log('onStart', file, file.name)}
                            onSuccess={ret => fastboard.insertMedia('', ret.entity)}
                            onError={err => console.log('onError', err)}
                        >
                            <img src={videoSvg} />
                        </Upload>
                    </PagePreviewCell>
                    <PagePreviewCell title={intl.get('upload_audio')}>
                        <Upload 
                            action={`/v1/agorartc/tenant/${config.tenantId}/whiteboard/call/${callId}/conversion/upload`}
                            multiple={true}
                            accept=".mp3"
                            onStart={file => console.log('onStart', file, file.name)}
                            onSuccess={ret => fastboard.insertMedia('', ret.entity)}
                            onError={err => console.log('onError', err)}
                        >
                            <img src={audioSvg} />
                        </Upload>
                    </PagePreviewCell>
                    <PagePreviewCell title={intl.get('close_white')}>
                        <img src={exitSvg} onClick={() => setIsModalVisible(true)} />
                    </PagePreviewCell>
                </RoomControllerMidBox>
            </RoomControllerBox>
        </RoomWhite>
        , whiteboardRoomInfo.domNode || videoRef.current)
    }, [whiteboardRoomInfo, whiteboardUser, whiteboardVisible, callId])

    var waitTitle = step === 'invite' ? intl.get('inviteTitle') : intl.get('ptitle')
    let videoLinking = step === 'current' && !!remoteUsers.length; //通话中 有其他人加入
    var isDisabledWhiteboard = !videoLinking || callingScreenSwitch || whiteboardVisible;

    return (
        <React.Fragment>
            <Wrapper role={step} top={top} className={`${utils.isMobile ? 'full_screen' : ''} ${top || show || hideDefaultButton ? '' : 'hide'}`}>
                {!top && <span onClick={handleMini} className={step === 'current' ? 'icon-mini' : 'icon-close'}></span>}
                <CurrentWrapper className={step === 'current' ? '' : 'hide'}>
                    <CurrentTitle>
                        <span>{time  ? intl.get('calling') : intl.get('waitCalling')}</span>
                        {time ? <TimeControl /> : ''}
                    </CurrentTitle>
                    <CurrentBodyMore>
                        <TopVideoBox className='top'>
                            {
                                step === 'current' && !!currentChooseUser && remoteUsers
                                .concat(whiteboardUser || [])
                                .concat(localUser || [])
                                .filter(({ uid }) => uid !== currentChooseUser?.uid)
                                .map((user) => {
                                    let {isWhiteboard = false, isLocal = false, uid, videoTrack, hasAudio, audioTrack } = user;

                                return isWhiteboard 
                                ? <WhiteboardPlayer 
                                    key={uid} 
                                    setWhiteboardRoomInfo={setWhiteboardRoomInfo}
                                    bindClick={() => setCurrentChooseUser(user)}
                                  />
                                : <MediaPlayer
                                    bindClick={() => setCurrentChooseUser(user)}
                                    key={uid} 
                                    isLocal={isLocal}
                                    name={idNameMap[uid] || ''} 
                                    hasAudio={isLocal ? sound : hasAudio}
                                    audioTrack={audioTrack} 
                                    videoTrack={videoTrack} 
                                    />
                                })
                            }
                        </TopVideoBox>
                        <CurrentVideo>
                            {step === 'current' && currentChooseUser && (<CurrentBodySelf isMobile={utils.isMobile}>
                                {!currentChooseUser.isWhiteboard && <div className='info'>
                                    <CurrentBodyMicro className='self'>
                                        <span className={(currentChooseUser.isLocal ? sound : currentChooseUser.hasAudio) ? 'icon-microphone' : 'icon-microphone-close'}></span>
                                    </CurrentBodyMicro>
                                    <span>{
                                        currentChooseUser ?  currentChooseUser.isLocal 
                                        ? intl.get('me') 
                                        : `${intl.get('agent')}-${idNameMap[currentChooseUser.uid] || ''}`  : ''    
                                    }</span>
                                    </div>}
                                <div id='visitor_video' ref={videoRef}>
                                    {whiteboardVisible && <App />}
                                </div>
                                <span className='icon-smile'></span>
                            </CurrentBodySelf>)}
                        </CurrentVideo>
                    </CurrentBodyMore>
                    <CurrentFooter top={top}>
                        <div onClick={handleSound}><span className={sound ? 'icon-sound' : 'icon-sound-close'}></span></div>
                        <div onClick={handleFace}><span className={face ? 'icon-face' : 'icon-face-close'}></span></div>
                        {!utils.isMobile && top && <div onClick={onDesktopControl}><span className={`icon-desktop-share ${whiteboardVisible ? 'gray' : ''}`}></span></div>}
                        <div onClick={() => void (!isDisabledWhiteboard && bindWhiteboardClick())}><span className={`icon-white-board ${isDisabledWhiteboard  ? 'gray' : ''}`}></span></div>
                        <div onClick={handleClose}><span className='icon-off'></span></div>
                    </CurrentFooter>
                    <VecModal
                        visible={isModalVisible}
                        onOk={handleWhiteOk}
                        onCancel={handleWhiteCancel}
                    >
                        确认关闭互动白板吗？
                    </VecModal>
                </CurrentWrapper>
                {/* 等待页面 */}
                <WaitWrapper className={!['enquiry', 'current'].includes(step) ? '' : 'hide'}>
                    <WaitTitle>
                        <h2>{waitTitle}</h2>
                    </WaitTitle>
                    <WaitAgent>
                        {step === 'invite' && <TimeControl />}
                        <WaitAgentLogo>
                            <img src={compInfo.avatar ? compInfo.avatar : logo}  />
                        </WaitAgentLogo>
                        <WaitAgentDesc>
                            {compInfo.name ? compInfo.name : ''}
                        </WaitAgentDesc>
                    </WaitAgent>
                    <WaitTip>{tip}</WaitTip>
                    {step === 'invite' ? (
                        <InviteOpera>
                            <div className='recive'>
                                <div>
                                    <span className='icon-answer' onClick={callbackRecived}></span>
                                </div>
                                <div>{intl.get('reciveVideo')}</div>
                            </div>
                            <div className='hung'>
                                <div>
                                    <span className='icon-off' onClick={callbackReject}></span>
                                </div>
                                <div>{intl.get('closeVideo')}</div>
                            </div>
                        </InviteOpera>
                    ) : (
                        <WaitOpera role={step} ref={stepRef}>
                            <div>
                                {
                                    step === 'start' ? <span onClick={handleStart} className='icon-answer'></span> : <span onClick={handleClose} className='icon-off'></span>
                                }
                            </div>
                            <div>{desc}</div>
                        </WaitOpera>
                    )}
                </WaitWrapper>
                {step === 'enquiry' && <Enquiry />}
            </Wrapper>
            <DefaultConnect onClick={handleConnect} className={hideDefaultButton || top || show ? 'hide' : ''}>
                <span className='icon-logo'>联系客服</span>
            </DefaultConnect>
        </React.Fragment>
    )
}
