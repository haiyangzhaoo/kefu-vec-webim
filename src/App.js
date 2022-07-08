import React, { Suspense, useEffect, useLayoutEffect, useState } from 'react'
import '@/assets/css/icon.scss'
import '@/assets/css/common.scss'
import '@/ws/webim.config'
import Loading from './components/Loading'
import intl from 'react-intl-universal'
import queryString from 'query-string'
import { HashRouter } from "react-router-dom"
import Router from './router'
import transfer from '@/common/transfer'
import { POSTMESSAGE_IFRAME_SUCCESS, POSTMESSAGE_HASH_RESERVE, POSTMESSAGE_HASH_RESERVERECORD } from '@/assets/constants/events'

// import ws from './ws'

var lang = queryString.parse(location.search).lang || 'zh-CN'

const locales = {
    "en-US": require('@/assets/locales/en-US').default,
    "zh-CN": require('@/assets/locales/zh-CN').default,
}
intl.init({
    currentLocale: lang,
    locales
})

// const Video = React.lazy(async () => {
//     await Promise.all([
//         ws.initConnection(),
//         intl.init({
//             currentLocale: lang,
//             locales
//         })
//     ])

//     return import('./pages/video')
// })

// const Reserve = React.lazy(() => import('./pages/reserve'))

export default function App() {
    const [hashPath, setHashPath] = useState('')

    useLayoutEffect(() => {
        transfer.send({event: POSTMESSAGE_IFRAME_SUCCESS})
    }, [])

    useEffect(() => {
        transfer.listen(msg => {
            const {event} = msg

            switch(event) {
                case POSTMESSAGE_HASH_RESERVE:
                case POSTMESSAGE_HASH_RESERVERECORD:
                    setHashPath(event.split('_')[1])
                    break;
                default:
                    break;
            }
        })
    }, [])

    return <React.Fragment>
        <Suspense fallback={<Loading />}>
            <HashRouter>
                <Router path={hashPath} />
                {/* <Routes>
                    <Route path="/" element={<Video />} />
                    <Route path="reserve" element={<Reserve />} />
                </Routes> */}
            </HashRouter>
        </Suspense>
    </React.Fragment>
}
