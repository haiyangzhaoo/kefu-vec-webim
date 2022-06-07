import styled from 'styled-components'

export const Wrapper = styled.div`
    position: absolute;
    width: 242px;
    height: 307px;
    right: ${props => props.top ? '10px' : 0};
    bottom: ${props => props.top ? '10px' : 0};
    border-radius: 4px;
    box-shadow: 0px 0px 10px #ccc;
    .icon-mini {
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
        color: ${props => props.role === 'current' ? 'gray' : 'white'};
        z-index: 100;
    }
`

export const WaitWrapper = styled.div`
    max-width: 100%;
    margin: 0 auto;
    height: 100%;
    border-radius: 4px;
    background-color: rgba(51, 51, 51, .8);
    color: #fff;
`

export const WaitTitle = styled.div`
    height: 30%;
    box-sizing: border-box;
    padding: calc(15% - 15px) 0;
    h2 {
        font-size: 16px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-weight: normal;
    }
`

export const WaitAgent = styled.div`
    height: 30%;
    font-size: 13px;
`
export const WaitAgentLogo = styled.div`
    text-align: center;
    img {
        height: 60px;
        width: 60px;
        border-radius: 50%;
    }
`

export const WaitAgentDesc = styled.div`
    text-align: center;
    margin-top: 2%;
`

export const WaitTip = styled.p`
    height: 15%;
    padding: 0 10px;
    line-height: 20px;
    text-align: center;
    font-size: 13px;
`

export const WaitOpera = styled.div`
    div {
        &:first-child {
            width: 40px;
            height: 40px;
            text-align: center;
            border-radius: 50%;
            margin: 0 auto;
            background: linear-gradient(172deg, ${props => props.role === 'start' ? '#5ef61e' : '#f5515f'} , ${props => props.role === 'start' ? '#44d434' : '#e92744'});
            position: relative;
            cursor: pointer;
            span {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                &::before {
                    font-size: 35px;
                }
            }
        }
        &:last-child {
            margin-top: 2%;
            text-align: center;
            font-size: 13px;
        }
    }
`


// 视频中
export const CurrentWrapper = styled.div`
    max-width: 998px;
    margin: 0 auto;
    height: 100%;
`

export const CurrentTitle = styled.div`
    height: 10%;
    position: relative;
    font-size: 13px;
    span {
        &:first-child {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
        }
        &:nth-child(2) {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
        }
    }
`

export const CurrentBody = styled.div`
    height: 80%;
    position: relative;
    div {
        cursor: pointer;
        width: 100%;
        height: 100%;
    }
    .pos {
        position: absolute;
        width: 20%;
        height: 20%;
        top: 10px;
        left: 10px;
        > div {
            &:first-child {
                position: absolute;
                top: 0;
                left: 0;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: #fff;
                color: #3689f7;
                z-index: 10;
                span {
                    line-height: 20px;
                    &::before {
                        font-size: 20px;
                    }
                }
            }
            &:last-child {
                > div {
                    z-index: 5;
                }
            }
        }
    }
    .info {
        height: 30px;
        color: #fff;
        position: absolute;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        z-index: 10;
        > div {
            display: inline-block;
            background-color: #fff;
            color: #3689f7;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-right: 5px;
            span {
                line-height: 20px;
                &::before {
                    font-size: 20px;
                }
            }
        }
        > span {
            height: 30px;
            line-height: 30px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }
    .self {
        z-index: 10;
        color: ${props => props.sound ? '#3689f7' : '#d7474a'} !important;
    }
    .agent {
        color: ${props => props.agentSound ? '#3689f7' : '#d7474a'} !important;
    }
`
export const CurrentBodySelf = styled.div`
    width: 100%;
    height: 100%;
    div {
        width: 100%;
        height: 100%;
    }
    #visitor_video {
        background-color: #000;
    }
    .icon-microphone-close {
        color: #FD3E3F;
    }
    .info {
        height: 30px;
        color: #fff;
        position: absolute;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        z-index: 10;
        > div {
            display: inline-block;
            background-color: #fff;
            color: #3689f7;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-right: 5px;
            span {
                line-height: 20px;
                &::before {
                    font-size: 20px;
                }
            }
        }
        > span {
            height: 30px;
            line-height: 30px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }
`

export const CurrentBodyAgent = styled.div`
    background: #000;
`

export const CurrentBodyMicro = styled.div`

`

export const CurrentFooter = styled.div`
    height: 10%;
    display: flex;
    align-items: center;
    justify-content: center;
    div {
        height: 75%;
        width: 10%;
        border-radius: 5px;
        border: 1px solid #d7d7d7;
        margin: 0 5px;
        position: relative;
        color: #3689f7;
        cursor: pointer;
        span {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        &:last-child, .icon-sound-close, .icon-face-close {
            color: #d7474a;
        }
    }
`

export const CurrentBodyMore = styled.div`
    height: 80%;
    position: relative;
`

export const TopVideoBox = styled.div`
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    z-index: 99;
    > div {
        margin-right: 10px;
    }
`

export const CurrentVideo = styled.div`
    height: 100%;
    width: 100%;
    position: relative;
`

