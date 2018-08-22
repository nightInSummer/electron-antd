import React from 'react'
import { Table, Button, Icon, Modal, Form, Input, Select, InputNumber, DatePicker, Popconfirm } from 'antd'
import moment from 'moment'
import * as API from '../../apis'
import {message} from "antd/lib/index"

const Option = Select.Option
const FormItem = Form.Item

async function deleteItems(id) {
  const res = await API.seven.deleteWastage({id})
  if(res) {
    message.success('删除成功！')
    window.location.reload()
    window.location.href = '#/loggedin?type=7'
  }
}

const columns = [
  { title: '客户信息（ชื่อลูกค้า）', dataIndex: 'name', key: 'name' },
  { title: '车牌号（ทะเบียนรถ）', dataIndex: 'plate', key: 'plate' },
  { title: '操作（แก้ไข）', dataIndex: '', key: 'x', render: () => '-' },
]

const expandedRowRender = (record) => {
  const type = ['肉损（เนื้อซี้）', '果损（ลูกทุเรียนซี้）', '第三步耗损', '第四步耗损']
  const columns = [
    { title: '类型（รูปแบบ）', dataIndex: 'type', key: 'type', render: (text) => type[text] },
    { title: '数量（จำนวน）', dataIndex: 'number', key: 'number' },
    { title: '日期（เวลา）', dataIndex: 'date', key: 'date', render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss') },
    { title: '操作（แก้ไข）', dataIndex: 'id', key: 'id', render: (text) => (
        <Popconfirm title="确认删除?" onConfirm={ () => { deleteItems(text) } } okText="确定（ตกลง）" cancelText="取消（ยกเลิก）">
          <a href="javascript:;">删除（ลบ）</a>
        </Popconfirm>
      )
    }
  ]

  return (
    <Table
      columns={columns}
      dataSource={record.wastages}
      pagination={false}
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
      sourceData: [],
      customer: []
    }
  }

  async componentDidMount() {
    const res = await API.seven.getWastage()
    const customer = await API.customer.getCustomer()
    res.list.forEach((ret, i) => { ret['key'] = i })
    this.setState({
      sourceData: res.list,
      customer: customer.list
    })
  }

  async handleOk() {
    const result = this.props.form.getFieldsValue()

    const data = {
      id: result.user,
      wastage: {
        type: Number(result.type),
        number: result.number || 0
      }
    }
    const res =  await API.seven.saveWastage(data)
    if(res.data) {
      message.success('保存成功！')
      window.location.reload()
      window.location.href = '#/loggedin?type=7'
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

  async submitFilter() {
    const result = this.props.form.getFieldsValue()
    const filter = {}
    result.dateToolbar && (filter['time'] = moment(result.dateToolbar).format('YYYY-MM-DD'))
    result.userToolbar && (filter['name'] = result.userToolbar)
    result.plateToolbar && (filter['plate'] = result.plateToolbar)
    const res = await API.seven.getWastage(filter)
    res.list.forEach((ret, i) => { ret['key'] = i })
    this.setState({
      sourceData: res.list
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { sourceData } = this.state
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
            label="耗损种类（ประเภท ซี้）"
          >
            {getFieldDecorator('type', { initialValue: '0' })(
              <Select style={{ width: 200 }}>
                <Option value="0">果损（ลูกทุเรียนซี้）</Option>
                <Option value="1">肉损（เนื้อซี้）</Option>
                <Option value="2">第三步耗损</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="数量（จำนวน）"
          >
            {getFieldDecorator('number', { initialValue: '' })(
              <InputNumber />
            )}
          </FormItem>
        </Modal>
      </div>
    )
  }
}

