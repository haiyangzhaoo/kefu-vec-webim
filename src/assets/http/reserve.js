import request from "../../tools/request";

// 获取验证码
export const sendCode = (tenantId, phone) => {
    // return request({
    //     url: ` /v1/subscribe/tenant/${tenantId}/visitor/sendSmsVerifyCode`,
    //     method: 'POST',
    //     data: JSON.stringify({
    //         phone
    //     })
    // })
    
    return Promise.resolve({status: 'OK', entities: []})
}

// 登录
export const userLoginWithCode = (tenantId, phone, verifyCode) => {
    // return request({
    //     url: `/v1/subscribe/tenant/${tenantId}/visitor/login`,
    //     method: 'POST',
    //     data: JSON.stringify({
    //         phone,
    //         verifyCode
    //     })
    // })

    return Promise.resolve({
        "status": "OK",
        "entity": {
            "loginUser": {
                "userId": "6063cbff-cf7b-488c-b276-17f24818d7b9",
                "tenantId": 28994,
                "userName": null,
                "password": null,
                "phone": "13662124786",
                "createDateTime": "2022-08-03 10:38:46",
                "lastUpdateDateTime": "2022-08-03 10:38:46"
            },
            "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpbklkIjoiNjA2M2NiZmYtY2Y3Yi00ODhjLWIyNzYtMTdmMjQ4MThkN2I5IiwiZXhwIjoxNjYwMDk5MTQ0fQ.5SKEraQ9O9fikWDtXQ26bsLlmUPrm_XNzgL0Nt7mDz8"
        }
    })
}

// 退出
export const userLogout = (tenantId, userId, token) => {
    // return request({
    //     url: `/v1/subscribe/tenant/${tenantId}/visitor/${userId}/logout`,
    //     method: 'POST',
    //     headers: {token}
    // })

    return Promise.resolve({
        "status": "OK"
    })
}

// 业务列表
export const businessList = tenantId => {
    // return request({
    //     url: `/v1/subscribe/tenant/${tenantId}/visitor/business/type?page=0&size=100`,
    //     method: 'get'
    // })
    
    return Promise.resolve({
        "status": "OK",
        "entities": [
            {
                "id": 7,
                "tenantId": 20016,
                "name": "business-2",
                "description": "",
                "creatorId": "0a737b6f-d5eb-4f7b-9ede-8f5adf2c22d3",
                "createDatetime": "2022-07-27 15:47:21",
                "lastUpdateAgentId": null,
                "lastUpdateDateTime": "2022-07-27 15:47:21",
                "enabled": true
            },
            {
                "id": 6,
                "tenantId": 20016,
                "name": "business-1",
                "description": "",
                "creatorId": "0a737b6f-d5eb-4f7b-9ede-8f5adf2c22d3",
                "createDatetime": "2022-07-27 15:47:15",
                "lastUpdateAgentId": null,
                "lastUpdateDateTime": "2022-07-27 15:47:15",
                "enabled": true
            },
            {
                "id": 1,
                "tenantId": 20016,
                "name": "222",
                "description": null,
                "creatorId": "0a737b6f-d5eb-4f7b-9ede-8f5adf2c22d3",
                "createDatetime": "2022-07-19 15:48:55",
                "lastUpdateAgentId": null,
                "lastUpdateDateTime": "2022-07-19 15:48:55",
                "enabled": true
            },
            {
                "id": 2,
                "tenantId": 20016,
                "name": "111",
                "description": null,
                "creatorId": "0a737b6f-d5eb-4f7b-9ede-8f5adf2c22d3",
                "createDatetime": "2022-07-18 17:39:36",
                "lastUpdateAgentId": null,
                "lastUpdateDateTime": "2022-07-18 17:39:36",
                "enabled": true
            },
            {
                "id": 3,
                "tenantId": 20016,
                "name": "内科",
                "description": null,
                "creatorId": "0a737b6f-d5eb-4f7b-9ede-8f5adf2c22d3",
                "createDatetime": "2022-07-08 11:27:38",
                "lastUpdateAgentId": null,
                "lastUpdateDateTime": "2022-07-08 11:27:38",
                "enabled": true
            },
            {
                "id": 4,
                "tenantId": 20016,
                "name": "外科",
                "description": null,
                "creatorId": "0a737b6f-d5eb-4f7b-9ede-8f5adf2c22d3",
                "createDatetime": "2022-07-08 11:27:31",
                "lastUpdateAgentId": null,
                "lastUpdateDateTime": "2022-07-08 11:27:31",
                "enabled": true
            },
            {
                "id": 5,
                "tenantId": 20016,
                "name": "口腔门诊",
                "description": null,
                "creatorId": "0a737b6f-d5eb-4f7b-9ede-8f5adf2c22d3",
                "createDatetime": "2022-07-08 11:27:17",
                "lastUpdateAgentId": null,
                "lastUpdateDateTime": "2022-07-08 11:27:17",
                "enabled": true
            }
        ],
        "first": true,
        "last": true,
        "size": 10,
        "number": 0,
        "numberOfElements": 7,
        "totalPages": 1,
        "totalElements": 7
    })
}

// 最近7天日历
export const sevenDays = (tenantId, date) => {
    // return request({
    //     url: `/v1/subscribe/tenant/${tenantId}/visitor/calendar?fromDate=${date}`,
    //     method: 'get'
    // })
    return Promise.resolve({
        "status": "OK",
        "entities": [
            {
                "week": 4,
                "subscribeDate": "2022-08-04"
            },
            {
                "week": 5,
                "subscribeDate": "2022-08-05"
            },
            {
                "week": 6,
                "subscribeDate": "2022-08-06"
            },
            {
                "week": 7,
                "subscribeDate": "2022-08-07"
            },
            {
                "week": 1,
                "subscribeDate": "2022-08-08"
            },
            {
                "week": 2,
                "subscribeDate": "2022-08-09"
            },
            {
                "week": 3,
                "subscribeDate": "2022-08-10"
            }
        ]
    })
}

// 剩余资源
export const restBusiness = (tenantId, businessId, subscribeDate) => {
    // return request({
    //     url: `/v1/subscribe/tenant/${tenantId}/visitor/business/${businessId}/resource/surplus-number`,
    //     method: 'POST',
    //     data: JSON.stringify({
    //         subscribeDate
    //     })
    // })
    
    return Promise.resolve({
        "status": "OK",
        "entities": [
            {
                "surplusId": "a6f577d279d80983c9dc3f533743d559",
                "subscribeTime": "4",
                "timePeriod": "9:30:00-12:30:00",
                "maxReservationNum": 5,
                "reservationNum": 0,
                "surplusReservationNum": 5
            },
            {
                "surplusId": "a6f577d279d80983c9dc3f533743d560",
                "subscribeTime": "4",
                "timePeriod": "13:30:00-18:30:00",
                "maxReservationNum": 5,
                "reservationNum": 0,
                "surplusReservationNum": 5
            }
        ]
    })
}

// 创建预约
export const createTask = data => {
    // return request({
    //     url: `/v1/subscribe/tenant/${data.tenantId}/visitor/${data.creatorId}/business/${data.resourceDetailId}/task`,
    //     method: 'POST',
    //     headers: {token: data.token},
    //     data: JSON.stringify(data)
    // })

    return Promise.resolve({
        "status": "OK"
    })
}

// 预约记录
export const reserveList = data => {
    // return request({
    //     url: `/v1/subscribe/tenant${data.tenantId}/visitor/${data.creatorId}/task/list`,
    //     method: 'POST',
    //     headers: {token: data.token},
    //     data: JSON.stringify({
    //         creatorId: data.creatorId
    //     })
    // })
    
    return Promise.resolve({
        "status": "OK",
        "entities": [
            {
                "id": "576b3b51-e412-4259-8da5-5498bd9153d1",
                "tenantId": 20016,
                "resourceDetailId": 470,
                "templateId": 1,
                "subscribeVisitorId": "3661875c-becc-44bb-ade8-5fb9744ba0f0",
                "identity": null,
                "visitorName": "访客名称",
                "creatorId": "98588a7e-e35c-43dc-8013-af85e719c982",
                "creatorType": "Visitor",
                "contact": "13662124786",
                "targetSystem": "VEC",
                "jobId": "testtest",
                "queueId": 2,
                "queueName": "技能组1",
                "businessTypeId": 6,
                "businessTypeName": "business-1",
                "agentUserId": null,
                "agentUserTrueName": null,
                "taskStatus": "CREATED",
                "taskResultStatus": "UNFINISHED",
                "remark": null,
                "subscribeNoticeDateTime": "2022-08-05 09:25:00",
                "subscribeStartDateTime": "2022-08-05 09:30:00",
                "subscribeEndDateTime": "2022-08-05 18:30:00",
                "taskRunDateTime": null,
                "taskStartDateTime": null,
                "taskEndDateTime": null,
                "createDateTime": "2022-08-03 13:56:21",
                "lastUpdateDateTime": "2022-08-03 13:56:21",
                "noticeBeforeMinutes": 5,
                "subscribeTimePeriod": "2022-08-05 周五 09:30:00-18:30:00",
                "template": null
            }
        ],
        "first": true,
        "last": true,
        "size": 10,
        "number": 0,
        "numberOfElements": 1,
        "totalPages": 1,
        "totalElements": 1
    })
}

// 取消预约
export const cancelMask = data => {
    // return request({
    //     url: `/v1/subscribe/tenant/${data.tenantId}/visitor/${data.userId}/task/${data.id}`,
    //     method: 'DELETE',
    //     headers: {token: data.token}
    // })

    return Promise.resolve({
        "status": "OK"
    })
}
