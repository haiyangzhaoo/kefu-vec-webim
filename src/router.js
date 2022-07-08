import React, { useEffect, useLayoutEffect, useState } from 'react'
import '@/ws/webim.config'
import { useRoutes, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import Loading from './components/Loading'
import ws from './ws'
import transfer from '@/common/transfer'
var _const = require("@/pages/plugin/common/const");
import commonConfig from '@/common/config'

const Reserve = React.lazy(() => import('./pages/reserve'))
const ReserveRecord = React.lazy(() => import('./pages/reserveRecord'))
const Video = React.lazy(() => import('./pages/video'))

// 这种路由不能跳转 不知道为什么？？？
// export default function Router({path}) {
//     const [init, setInit] = useState(false)
//     const navigate = useNavigate()

//     const element = useRoutes([
//         {
//             path: "/",
//             element: <Video />,
//         },
//         {
//             path: "reserve",
//             element: <Reserve />,
//         },
//         {
//             path: "reserveRecord",
//             element: <ReserveRecord />
//         }
//     ])

//     useEffect(() => {
//         async function getWs() {
//             await ws.initConnection()
//             setInit(true)
//         }
//         getWs()
//     }, [])
    
//     useEffect(() => {
//         path && navigate(path, {replace: true})
//     }, [init])

//     return init ? element : <Loading />
// }


export default function Router({path}) {
    const [init, setInit] = useState(false)
    const navigate = useNavigate()
    const routes = [
        {
            path: "/",
            element: <Video />,
        },
        {
            path: "reserve",
            element: <Reserve />,
        },
        {
            path: "reserveRecord",
            element: <ReserveRecord />
        }
    ]

    useLayoutEffect(() => {
        // 提前回去用户自定义的配置
        transfer.listen(msg => {
            const { event, data } = msg
            switch(event) {
                case _const.EVENTS.INIT_CONFIG:
                    commonConfig.setConfig(data);
                    break;
                default:
                    break;
            }
        })
    }, [])

    useEffect(() => {
        async function getWs() {
            await ws.initConnection()
            setInit(true)
        }
        getWs()
    }, [])

    useEffect(() => {
        path && navigate(path)
    }, [init])

    return init ? (<Routes>
        {routes.map(item => <Route path={item.path} key={item.path} element={item.element} />)}
    </Routes>
        ) : <Loading />
}
