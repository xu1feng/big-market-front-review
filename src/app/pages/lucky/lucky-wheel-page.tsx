"use client"

import React, {useEffect, useRef, useState} from 'react'
// @ts-expect-error 代码是指 ts 忽略该组件本身存在的异常
import {LuckyWheel} from '@lucky-canvas/react'

import {queryRaffleAwardList, draw} from '@/apis'
import {RaffleAwardVO} from "@/types/RaffleAwardVO";

export function LuckyWheelPage() {
    const [prizes, setPrizes] = useState([{}])
    const myLucky = useRef<never>(null)

    const [blocks] = useState([
        {padding: '10px', background: '#869cfa', imgs: [{src: "https://bugstack.cn/images/system/blog-03.png"}]}
    ])

    const [buttons] = useState([
        {radius: '40%', background: '#617df2'},
        {radius: '35%', background: '#afc8ff'},
        {
            radius: '30%', background: '#869cfa',
            pointer: true,
            fonts: [{text: '开始', top: '-10px'}]
        }
    ])

    // 查询奖品列表
    const queryRaffleAwardListHandle = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const userId = String(queryParams.get('userId'));
        const activityId = Number(queryParams.get('activityId'));
        const result = await queryRaffleAwardList(userId, activityId);
        const {code, info, data} = await result.json();
        if (code != "0000") {
            window.alert("获取抽奖奖品列表失败 code:" + code + " info:" + info)
            return;
        }

        // 创建一个新的奖品数组
        const prizes = data.map((award: RaffleAwardVO, index: number) => {
            const background = index % 2 === 0 ? '#e9e8fe' : '#b8c5f2';
            return {
                background: background,
                fonts: [{id: award.awardId, text: award.awardTitle, top: '15px'}]
            };
        });

        // 设置奖品数据
        setPrizes(prizes)
    }

    // 调用随机抽奖
    const randomRaffleHandle = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const userId = String(queryParams.get('userId'));
        const activityId = Number(queryParams.get('activityId'));
        const result = await draw(userId, activityId);
        const {code, info, data} = await result.json();
        if (code != "0000") {
            window.alert("随机抽奖失败 code:" + code + " info:" + info)
            return;
        }
        // 为了方便测试，mock 的接口直接返回 awardIndex 也就是奖品列表中第几个奖品。
        return data.awardIndex - 1;
    }

    useEffect(() => {
        queryRaffleAwardListHandle().then(r => {
        });
    }, [])

    return <div>
        <LuckyWheel
            ref={myLucky}
            width="300px"
            height="300px"
            blocks={blocks}
            prizes={prizes}
            buttons={buttons}
            onStart={() => {
                // @ts-expect-error 代码是指 ts 忽略该组件本身存在的异常
                myLucky.current.play()
                setTimeout(() => {
                    // 抽奖接口
                    randomRaffleHandle().then(prizeIndex => {
                        // @ts-expect-error 代码是指 ts 忽略该组件本身存在的异常
                            myLucky.current.stop(prizeIndex);
                        }
                    );

                }, 2500)
            }}
            onEnd={
                // @ts-expect-error 代码是指 ts 忽略该组件本身存在的异常
                prize => {
                    alert('恭喜你抽到【' + prize.fonts[0].text + '】奖品ID【' + prize.fonts[0].id + '】')
                }
            }
        />
    </div>
}