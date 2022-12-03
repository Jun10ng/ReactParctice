import React, { useEffect, useState } from 'react'
import Title from 'antd/es/typography/Title'
import { Button, Form, Input, message, Select, Space, StepProps, Steps } from 'antd';
import style from './New.module.css'
import axios from 'axios';

export interface CategoryModel {
  id:number
  title:string
  value:string
}
export default function NewsAdd() {
  const [current, setCurrent] = useState(0);
  const [categoryList, setCategoryList]= useState(Array<CategoryModel>)

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

const items: StepProps[] = [
  {
    title: "基本信息",
    description: "新闻标题，新闻分类",
  },
  {
    title: "新闻内容",
    description: "主体内容",
  },
  {
    title: "新闻提交",
    description: "保存草稿或者提交审核",
  },
];

useEffect(() => {
  axios.get('/categories').then(
    res =>{
      let cl:CategoryModel[] = res.data
      setCategoryList(cl)
    }
  )
}, [])



  return (
    <div>
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <Title>撰写新闻</Title>
        <Steps items={items} key={"title"} current={current} />

        <div className={current === 0 ? "" : style.active}>
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={next}
            // onFinishFailed={next}
            autoComplete="off"
          >
            <Form.Item
              label="新闻标题"
              name="newstitle"
              rules={[{ required: true, message: "输入新闻标题" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="newscategory"
              rules={[
                { required: true, message: "输入新闻分类" },
              ]}
            >
              <Select options={categoryList}/>

              
            </Form.Item>
          </Form>
            </div>
        <div className={current === 1 ? "" : style.active}>2222222</div>
        <div className={current === 2 ? "" : style.active}>1333333</div>

        <div className="steps-action">
          {current < items.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {current === items.length - 1 && (
            <Button
              type="primary"
              onClick={() => message.success("Processing complete!")}
            >
              Done
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
              Previous
            </Button>
          )}
        </div>
      </Space>
    </div>
  );
}
