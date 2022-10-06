import styles from "./index.less";
import React, { useEffect, useState } from "react";
import api from "./service";
import useRequest from "@ahooksjs/use-request";
import { history } from "umi";
import { Form, message, Input, Button } from "antd";

export default () => {
  const [code, setCode] = useState("");

  useEffect(() => {
    createCode(4);
  }, []);

  const onFinish = (values: {
    code: string;
    username: string;
    password: string;
  }) => {
    if (code.toUpperCase() == values.code.toUpperCase()) {
      loginRun({
        username: values.username,
        password: values.password,
      });
    } else {
      createCode(4);
      message.warn("验证码错误");
    }
  };

  const { run: loginRun } = useRequest((obj) => api.login(obj), {
    manual: true,
    onSuccess: (res: any) => {
      if (res.result === 0) {
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("token", res.data.token);
        window.location.href = `${window.location.origin}/admin/article`;
      } else {
        message.error(res.message || "操作失败");
      }
    },
    onError: (res: any) => {
      message.error(res.message || "操作失败");
    },
  });

  const createCode = (length: number) => {
    let code = "";
    let checkCode = document.getElementById("checkCode");
    let codeChars = new Array(
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z"
    );
    for (let i = 0; i < length; i++) {
      let charNum = Math.floor(Math.random() * 62);
      code += codeChars[charNum];
    }
    if (checkCode) {
      setCode(code);
      checkCode.innerHTML = code;
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.modal}>
        <div className={styles.top}>拾柒的博客后台管理系统</div>
        <div className={styles.middle}>
          <Form
            onFinish={onFinish}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 18 }}
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: "请输入用户名!" }]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: "请输入密码!" }]}
            >
              <Input size="large" type="password" />
            </Form.Item>
            <Form.Item
              label="验证码"
              name="code"
              rules={[{ required: true, message: "请输入验证码!" }]}
            >
              <div className={styles.verify}>
                <Input
                  size="large"
                  suffix={
                    <div
                      id="checkCode"
                      className={styles.code}
                      onClick={() => {
                        createCode(4);
                      }}
                    ></div>
                  }
                />
              </div>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 2 }}>
              <div className={styles.loginBtn}>
                <Button
                  type="default"
                  onClick={() => {
                    history.push("/admin/course");
                  }}
                >
                  游客登录
                </Button>
                <Button type="primary" htmlType="submit">
                  用户登录
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};
