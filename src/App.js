import React, { Suspense, useEffect, useLayoutEffect, useState } from 'react'
import '@/assets/css/icon.scss'
import '@/assets/css/common.scss'
import '@/ws/webim.config'
import Loading from './components/Loading'
import intl from 'react-intl-universal'
import queryString from 'query-string'
import {
    HashRouter,
    Routes,
    Route,
} from "react-router-dom"
import Router from './router'
import transfer from '@/common/transfer'

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
        transfer.send({event: 'path_ok'})
    }, [])

    useEffect(() => {
        transfer.listen(msg => {
            const {event} = msg

            switch(event) {
                case 'path_reserve':
                case 'path_reserveRecord':
                    setHashPath(event)
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
