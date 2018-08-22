import React, { Component } from 'react'
import { Tabs } from 'antd'


import FirstTable from './components/firstTable'
import SecondTable from './components/secondTable'
import ThirdTable from './components/thirdTable'
import FourthTable from './components/fourthTable'
import FifthTable from './components/fifthTable'
import SixthTable from './components/sixthTable'
import SeventhTable from './components/seventhTable'

const TabPane = Tabs.TabPane

export default class LoggedIn extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const type = window.location.hash.split('?')[1].replace('type=', '')
    return (
      <div style={{ overflow: 'auto' }}>
        <Tabs defaultActiveKey={String(Number(type) || 1)}>
          <TabPane tab="第一步（ทุเรียนชั่งเข้า）" key='1'>
            <FirstTable />
          </TabPane>
          <TabPane tab="第二步（น้ำหนักชั่งปอก）" key='2'>
            <SecondTable />
          </TabPane>
          <TabPane tab="第三步（น้ำหนักหลังปอก）" key='3'>
            <ThirdTable />
          </TabPane>
          <TabPane tab="第四步（เข้าห้องบลาส）" key='4'>
            <SixthTable />
          </TabPane>
          <TabPane tab="第五步（น้ำหนักในห้องบลาส）" key='5'>
            <FourthTable />
          </TabPane>
          <TabPane tab="第六步（น้ำหนักในห้องเก็บ）" key='6'>
            <FifthTable />
          </TabPane>
          <TabPane tab="第七步" key='7'>
            <SeventhTable />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
