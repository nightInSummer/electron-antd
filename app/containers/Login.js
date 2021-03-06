import React, { Component, PropTypes } from 'react';
import {
  Button, Card, Input, Checkbox, Icon, AutoComplete, message,
} from 'antd';

export default class Login extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      loading: false,
    }
    this.users = ['user1', 'user2', 'user3'];
  }

  render() {
    let { loading, username, password, autoLogin } = this.state;
    return (
      <div className="login-body maxcontant">
        <Card title="登录" className="login-card" >
          <AutoComplete
            style={{ width: '100%' }}
            disabled={loading}
            dataSource={this.users}
            onChange={(username) => this.setState({ username })}
            filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            children={<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />}
          />

          <Input
            prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
            disabled={loading}
            type="password"
            defaultValue={password}
            placeholder="密码"
            style={{ marginTop: 10 }}
            onChange={(password) => {
              console.log(password.target.value)
              this.setState({ password: password.target.value })
            }}
            onPressEnter={value => {
              this.setState({ loading: true });
              this.login()
            }}
          />

          <div className="loginSubmit">
            <Checkbox
              disabled={loading}
              checked={autoLogin}
              onChange={(e, bool) => {
                this.setState({ autoLogin: !this.state.autoLogin }, () => {
                  if (!autoLogin) {
                    localStorage.setItem('user', JSON.stringify({ autoLogin: false }))
                  }
                })
              }} >
              自动登录
								</Checkbox>
            <Button
              type="primary"
              loading={loading}
              onClick={() => {
                this.setState({ loading: true });
                this.login()
              }}
            >
              登 录
							</Button>
          </div>

        </Card>
      </div>
    );
  }

  login() {
    let { username, password } = this.state;
    console.log(username, password)
    if (username === 'admin' && password === 'admin123') {
      this.setState({ loading: false });
      message.success(`登录成功! 欢迎`);
      // 跳转页面 可传递参数
      this.props.router.push({ pathname: '/loggedin', state: { username, loggedIn: true } });
    } else {
      this.setState({ loading: false });
      message.error('用户名或密码错误！');
    }

  }
}
