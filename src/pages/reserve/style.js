import styled from 'styled-components'
import s from '@/assets/css/color'

export const Wrapper = styled.div`
    height: 100vh;
    .adm-tabs {
        height: calc(100% - 50px);
        .adm-tabs-content {
            height: calc(100% - 43px);
            overflow-y: auto;
        }
    }
    .adm-tabs-tab-wrapper {
        width: 50%;
        &.selected {
            background-color: ${s.theme};
        }
        .adm-tabs-tab {
            width: 100%;
            text-align: center;
        }
        .adm-tabs-tab-active {
            color: ${s.white};
        }
    }
`

export const Header = styled.header`
    height: 50px;
    padding: 0 20px;
    font-size: 20px;
    border-bottom: 1px solid ${s.border};
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    > span {
        &:last-child {
            cursor: pointer;
            color: ${s.theme};
        }
    }
`
