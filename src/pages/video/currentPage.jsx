import React from "react";
import { CurrentWrapper, CurrentTitle, CurrentFooter, CurrentBodySelf, CurrentBodyMicro, CurrentBodyMore, TopVideoBox, CurrentVideo, VideoBox } from './style'
import TimeControl from './comps/TimeControl'
import MediaPlayer from './comps/MediaPlayer/MediaPlayer'
import WhiteboardPlayer from './comps/WhiteboardPlayer'
import WhiteBoard from './comps/Whiteboard'
import { Badge } from 'antd-mobile'

export default React.forwardRef(function({}, ref) {
    
    return <CurrentWrapper className={step === 'current' ? '' : 'hide'}>
        <CurrentTitle>
            <span>{time  ? intl.get('calling') : intl.get('waitCalling')}</span>
            {time ? <TimeControl /> : ''}
        </CurrentTitle>
        <CurrentBodyMore className={chatVisible ? chatPos : ''}>
            <VideoBox>
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
                            {whiteboardVisible && <WhiteBoard 
                                whiteboardRoomInfo={whiteboardRoomInfo}
                                whiteboardUser={whiteboardUser}
                                whiteboardVisible={whiteboardVisible}
                                callId={callId}
                                domNode={videoRef.current}
                                handleClose={handleWhiteOk}
                            />}
                        </div>
                        {!currentChooseUser.videoTrack && <span className='icon-smile'></span>}
                    </CurrentBodySelf>)}
                </CurrentVideo>
            </VideoBox>
            {chatVisible && (utils.isMobile || !top) && getChat()}
        </CurrentBodyMore>
        <CurrentFooter top={top}>
            <div onClick={handleSound}><span className={sound ? 'icon-sound' : 'icon-sound-close'}></span></div>
            <div onClick={handleFace}><span className={face ? 'icon-face' : 'icon-face-close'}></span></div>
            {!utils.isMobile && top && <div onClick={onDesktopControl}><span className={`icon-desktop-share ${whiteboardVisible ? 'gray' : ''}`}></span></div>}
            <div onClick={() => void (!isDisabledWhiteboard && bindWhiteboardClick())}><span className={`icon-white-board ${isDisabledWhiteboard  ? 'gray' : ''}`}></span></div>
            <Badge content={chatUnread}>
                <div onClick={() => setChatVisible(!chatVisible)}>
                    <span className='icon-chat-button'></span>
                </div>
            </Badge>
            <div onClick={handleClose}><span className='icon-off'></span></div>
        </CurrentFooter>
    </CurrentWrapper>
})
