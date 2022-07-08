import React, { useEffect, useLayoutEffect, useState } from 'react'
import '@/ws/webim.config'
import { useRoutes, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import Loading from './components/Loading'
import ws from './ws'

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

    useEffect(() => {
        async function getWs() {
            await ws.initConnection()
            setInit(true)
        }
        getWs()
    }, [])

    useEffect(() => {
        path && navigate('reserve')
    }, [init])

    console.log(121212, routes.filter(item => item.path === 'reserve'))

    return init ? (<Routes>
        {routes.map(item => <Route path={item.path} key={item.path} element={item.element} />)}
    </Routes>
        ) : <Loading />
}
