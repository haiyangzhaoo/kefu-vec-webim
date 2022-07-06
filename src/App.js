import React, { Suspense } from 'react'
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

import ws from './ws'

var lang = queryString.parse(location.search).lang || 'zh-CN'

const locales = {
    "en-US": require('@/assets/locales/en-US').default,
    "zh-CN": require('@/assets/locales/zh-CN').default,
}

const Video = React.lazy(async () => {
    await Promise.all([
        ws.initConnection(),
        intl.init({
            currentLocale: lang,
            locales
        })
    ])

    return import('./pages/video')
})

const Reserve = React.lazy(() => import('./pages/reserve'))

export default function App() {
    return <React.Fragment>
        <Suspense fallback={<Loading />}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Video />} />
                    <Route path="reserve" element={<Reserve />} />
                </Routes>
            </BrowserRouter>
        </Suspense>
    </React.Fragment>
}
