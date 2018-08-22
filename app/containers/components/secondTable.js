import React from 'react'
import { Table, Button, Icon, Modal, Form, Input, Select, DatePicker, InputNumber, Popconfirm } from 'antd'
import moment from 'moment'
import * as API from '../../apis'
import _ from 'lodash'
import {message} from "antd/lib/index"

const Option = Select.Option
const FormItem = Form.Item

async function deleteItems(id) {
  const res = await API.second.deleteMachining({id})
  if(res) {
    message.success('删除成功！')
    window.location.reload()
    window.location.href = '#/loggedin?type=2'
  }
}

const columns = [
  { title: '客户信息（ชื่อลูกค้า）', dataIndex: 'name', key: 'name' },
  { title: '车牌号（ทะเบียนรถ）', dataIndex: 'plate', key: 'plate' },
  { title: '操作（แก้ไข）', dataIndex: '', key: 'x', render: () => '-' },
]

const expandedRowRender = (record) => {
  const type = ['好果（ลูกสวย）', '干虫果（ลูกหนอนแห้ง）', '湿虫果（ลูดหนอนน้ำ）', '大果（จัมโบ้`）']
  const columns = [
    { title: '类型（รูปแบบ）', dataIndex: 'type', key: 'type', render: (text) => type[text] },
    { title: '入库加工（น้ำหนักเข้าปอก）', dataIndex: 'number', key: 'number' },
    { title: '日期（เวลา）', dataIndex: 'time', key: 'time', render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss') },
    { title: '操作（แก้ไข）', dataIndex: 'id', key: 'id', render: (text) => (
        <Popconfirm title="确认删除?" onConfirm={ () => { deleteItems(text) } } okText="确定（ตกลง）" cancelText="取消（ยกเลิก）">
          <a href="javascript:;">删除（ลบ）</a>
        </Popconfirm>
      )
    }
  ]

  const total = _.reduce(record.stocks, (result, item) => {
    return result + item.number
  }, 0)

  const machining = _.reduce(record.machinings, (result, item) => {
    return result + item.number
  }, 0)

  const wastage = _.reduce(record.wastages, (result, item) => {
    return result + item.number
  }, 0)

  const surplus = total - machining - wastage
  return (
    <Table
      columns={columns}
      dataSource={record.machinings}
      pagination={false}
      footer={() => (<p><span>总（รวม）：<span style={{ color: '#ff2b4d' }}>{total}</span></span>&nbsp;&nbsp;&nbsp;&nbsp;<span>剩（เหลือ）：<span style={{ color: '#ff2b4d' }}>{surplus}</span></span></p>)}
    />
  )
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 },
  },
}

const toolbarItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
}

@Form.create()
export default class SecondTable extends React.Component{
  constructor() {
    super()
    this.state = {
      visible: false,
      list: [],
      sourceData: [],
      customer: []
    }
  }

  async componentDidMount() {
    const res = await API.second.getMachining()
    const customer = await API.customer.getCustomer()
    res.list.forEach((ret, i) => { ret['key'] = i })
    this.setState({
      sourceData: res.list,
      customer: customer.list
    })
  }

  async handleOk() {
    const { list } = this.state
    const result = this.props.form.getFieldsValue()
    const data = {}
    data.id = result.user
    data.machining = []
    list.forEach(ret => {
      data.machining.push({ type: Number(result['fruitType' + ret]), number: result['fruitNumber' + ret] })
    })

    const res = await API.second.saveMachining(data)
    if(res.data) {
      message.success('保存成功！')
      window.location.reload()
      window.location.href = '#/loggedin?type=2'
    } else {
      message.error(res.message)
    }
  }

  createCustomer() {
    const { customer } = this.state
    return customer.map((ret, index) => <Option key={index} value={ret.id}>{`${ret.name} - ${ret.plate}`}</Option>)
  }

  handleCancel() {
    this.setState({
      visible: false
    })
  }

  showModal() {
    this.setState({
      visible: true
    })
  }

  addNewOne() {
    const token = ~~(Math.random() * 10000) + 'new'
    this.state.list.push(token)
    this.setState({
      list: this.state.list
    })
  }

  async submitFilter() {
    const result = this.props.form.getFieldsValue()
    const filter = {}
    result.dateToolbar && (filter['time'] = moment(result.dateToolbar).format('YYYY-MM-DD'))
    result.userToolbar && (filter['name'] = result.userToolbar)
    result.plateToolbar && (filter['plate'] = result.plateToolbar)
    const res = await API.second.getMachining(filter)
    res.list.forEach((ret, i) => { ret['key'] = i })
    this.setState({
      sourceData: res.list
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { list, sourceData } = this.state
    return (
      <div style={{ padding: 20 }}>
        <div style={{
          marginBottom: 20,
          padding: 20,
          overflow: 'hidden',
          border: '1px #ccc solid',
          borderRadius: 7,
          backgroundColor: '#f5f5f5' }}
        >
          <Form inline>
            <FormItem
              {...toolbarItemLayout}
              label="时间（เวลา）"
            >
              {getFieldDecorator('dateToolbar', { initialValue: '' })(
                <DatePicker style={{ width: 160 }}/>
              )}
            </FormItem>
            <FormItem
              {...toolbarItemLayout}
              label="客户（ชื่อลูกค้า）"
            >
              {getFieldDecorator('userToolbar', { initialValue: '' })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...toolbarItemLayout}
              label="车牌号（ทะเบียนรถ）"
            >
              {getFieldDecorator('plateToolbar', { initialValue: '' })(
                <Input />
              )}
            </FormItem>
            <Button type="primary" style={{ float: 'right' }} onClick={this.submitFilter.bind(this)}><Icon type="search" />查询（ค้นหา）</Button>
          </Form>
        </div>
        <Button type="primary" style={{ marginBottom: 20 }} onClick={this.showModal.bind(this)}><Icon type="plus" />新增（เพิ่ม）</Button>
        <Table
          columns={columns}
          expandedRowRender={expandedRowRender}
          dataSource={sourceData}
        />
        <Modal
          title="新增（เพิ่ม）"
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        >
          <FormItem
            {...formItemLayout}
              label="客户（ชื่อลูกค้า）"
          >
            {getFieldDecorator('user', { initialValue: '' })(
              <Select
                style={{ width: 200 }}
                showSearch
                optionFilterProp='children'
              >
                { this.createCustomer() }
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="入库加工（น้ำหนักเข้าปอก）"
          >
            { list.map(ret =>
              <div key={ret} style={{ marginBottom: 10 }}>
                {getFieldDecorator('fruitType' + ret, { initialValue: '0' })(
                  <Select style={{ width: 120 }}>
                    <Option value="0">好果（ลูกสวย）</Option>
                    <Option value="1">干虫果（ลูกหนอนแห้ง）</Option>
                    <Option value="2">湿虫果（ลูดหนอนน้ำ）</Option>
                    <Option value="3">大果（จัมโบ้）</Option>
                  </Select>
                )}
                {getFieldDecorator('fruitNumber' + ret, { initialValue: '' })(
                  <InputNumber style={{ marginLeft: 20, width: '165px' }} />
                )}
              </div>
            ) }
            <a href='javascript: ;' onClick={ this.addNewOne.bind(this) }>+ 添加一条（เพิ่มอีกหนึ่งข้อ）</a>
          </FormItem>
        </Modal>
      </div>
    )
  }
}
