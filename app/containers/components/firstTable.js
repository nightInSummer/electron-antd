import React from 'react'
import { Table, Button, Icon, Modal, Form, Input, Select, InputNumber, DatePicker, message, Popconfirm } from 'antd'
import moment from 'moment'
import * as API from '../../apis'

const Option = Select.Option
const FormItem = Form.Item

async function deleteUser(id) {
  const res = await API.customer.deleteCustomer({id})
  if(res) {
    message.success('删除成功！')
    window.location.reload()
    window.location.href = '#/loggedin?type=1'
  }
}

async function deleteItems(id) {
  const res = await API.first.deleteStock({id})
  if(res) {
    message.success('删除成功！')
    window.location.reload()
    window.location.href = '#/loggedin?type=1'
  }
}

const columns = [
  { title: '客户信息（ชื่อลูกค้า）', dataIndex: 'name', key: 'name' },
  { title: '车牌号（ทะเบียนรถ）', dataIndex: 'plate', key: 'plate' },
  { title: '操作（แก้ไข）', dataIndex: 'id', key: 'id', render: (text) => (
      <Popconfirm title="确认删除?" onConfirm={ () => { deleteUser(text) } } okText="确定（ตกลง）" cancelText="取消（ยกเลิก）">
        <a href="javascript:;">删除（ลบ）</a>
      </Popconfirm>
    )
  },
]

const expandedRowRender = (record) => {
  const type = ['好果（ลูกสวย）', '干虫果（ลูกหนอนแห้ง）', '湿虫果（ลูดหนอนน้ำ）', '大果（จัมโบ้`）']
  const columns = [
    { title: '类型（รูปแบบ）', dataIndex: 'type', key: 'type', render: (text) => type[text] },
    { title: '来货重量（น้ำหนักที่รับมา）', dataIndex: 'number', key: 'number' },
    { title: '日期（เวลา）', dataIndex: 'time', key: 'time', render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss') },
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
      dataSource={record.stocks}
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
export default class FirstTable extends React.Component{
  constructor() {
    super()
    this.state = {
      visible: false,
      list: [],
      sourceData: []
    }
  }

  async componentDidMount() {
    const res = await API.first.getStock()
    console.log(res)
    res.list.forEach((ret, i) => { ret['key'] = i })
    this.setState({
      sourceData: res.list
    })
  }

  async handleOk() {
    const { list } = this.state
    const result = this.props.form.getFieldsValue()
    const data = {}
    data.name = result.user
    data.plate = result.plate
    data.stock = []
    list.forEach(ret => {
      data.stock.push({ type: Number(result['fruitType' + ret]), number: result['fruitNumber' + ret] })
    })

    const res = await API.first.saveStock(data)
    if(res) {
      message.success('保存成功！')
      window.location.reload()
      window.location.href = '#/loggedin?type=1'
    }
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
    const res = await API.first.getStock(filter)
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
            <Button onClick={this.submitFilter.bind(this)} type="primary" style={{ float: 'right' }} ><Icon type="search" />查询（ค้นหา）</Button>
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
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="车牌号（ทะเบียนร）"
          >
            {getFieldDecorator('plate', { initialValue: '' })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="来货重量（น้ำหนักที่รับมา）"
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
