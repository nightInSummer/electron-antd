import React from 'react'
import { Table, Button, Icon, Modal, Form, InputNumber, Select, message } from 'antd'
import * as API from '../../apis'

const Option = Select.Option
const FormItem = Form.Item

const type = ['一号库（ห้อง1）', '二号库（ห้อง2）', '三号库（ห้อง3）', '四号库（ห้อง4）']

const columns = [
  { title: '库号', dataIndex: 'id', key: 'id', render: (text) => type[text - 1] },
  { title: 'A级', dataIndex: 'levelA', key: 'levelA' },
  { title: 'B级', dataIndex: 'levelB', key: 'levelB' },
  { title: 'C级', dataIndex: 'levelC', key: 'levelC' },
  { title: 'D级', dataIndex: 'levelD', key: 'levelD' },
]

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

@Form.create()
export default class FourthTable extends React.Component{
  constructor() {
    super()
    this.state = {
      visible: false,
      list: [],
      sourceData: []
    }
  }

  async componentDidMount() {
    const res = await API.fourth.getChill()
    res.list.forEach((ret, i) => { ret['key'] = i })
    this.setState({
      sourceData: res.list
    })
  }

  async handleOk() {
    const { list } = this.state
    const result = this.props.form.getFieldsValue()
    const data = {}
    data.id = result.id
    data.levelA = 0
    data.levelB = 0
    data.levelC = 0
    data.levelD = 0
    data.storageId = result.storageId
    list.forEach(ret => {
      data[result['type' + ret]] = data[result['type' + ret]] + (result['number' + ret] || 0)
    })
    const res = await API.fourth.saveChill(data)
    if(res.data) {
      message.success('保存成功！')
      window.location.reload()
      window.location.href = '#/loggedin?type=5'
    } else {
      message.error(res.message)
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

  render() {
    const { getFieldDecorator } = this.props.form
    const { list, sourceData } = this.state

    return (
      <div style={{ padding: 20 }}>
        <Button type="primary" style={{ marginBottom: 20 }} onClick={this.showModal.bind(this)}><Icon type="plus" />新增（เพิ่ม）</Button>
        <Table
          columns={columns}
          dataSource={sourceData}
        />
        <Modal
          title="入库"
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        >
          <FormItem
            {...formItemLayout}
            label="冷冻库（ห้องบลาส）"
          >
            {getFieldDecorator('id', { initialValue: '1' })(
              <Select style={{ width: 120 }}>
                <Option value="1">一号库（ห้อง1）</Option>
                <Option value="2">二号库（ห้อง2）</Option>
                <Option value="3">三号库（ห้อง3）</Option>
                <Option value="4">四号库（ห้อง4）</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="入库加工（น้ำหนักเข้าปอก）"
          >
            { list.map(ret =>
              <div key={ret} style={{ marginBottom: 10 }}>
                {getFieldDecorator('type' + ret, { initialValue: 'levelA' })(
                  <Select style={{ width: 120 }}>
                    <Option value="levelA">A级</Option>
                    <Option value="levelB">B级</Option>
                    <Option value="levelC">C级</Option>
                    <Option value="levelD">D级</Option>
                  </Select>
                )}
                {getFieldDecorator('number' + ret, { initialValue: '' })(
                  <InputNumber style={{ marginLeft: 20, width: '165px' }} />
                )}
              </div>
            ) }
            <a href='javascript: ;' onClick={ this.addNewOne.bind(this) }>+ 添加一条（เพิ่มอีกหนึ่งข้อ）</a>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="冷藏库（ห้องเก็บ）"
          >
            {getFieldDecorator('storageId', { initialValue: '1' })(
              <Select style={{ width: 120 }}>
                <Option value="1">一号库（ห้อง1）</Option>
                <Option value="2">二号库（ห้อง2）</Option>
                <Option value="3">三号库（ห้อง3）</Option>
                <Option value="4">四号库（ห้องแช่คว้านเม็ด）</Option>
              </Select>
            )}
          </FormItem>
        </Modal>
      </div>
    )
  }
}
