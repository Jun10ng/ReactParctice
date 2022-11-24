import { Button, Form, Input, Modal, Radio, Select, Switch, Table } from 'antd'
import form from 'antd/es/form';
import { ColumnsType } from "antd/es/table";

import axios from 'axios';
import { values } from 'mobx';
import React, { useEffect, useState } from 'react'
import { Right } from './RightList';
import { Role } from './RoleList';

let RoleId2Type = new Map([
  [1, "超级管理员"],
  [2, "区域管理员"],
  [3, "区域编辑"]
]); 

let RoleIds = Array.from(RoleId2Type.values())
export interface User{
  id: number;
  username: string;
  password: number;
  roleState: boolean;
  default: boolean;
  region: string;
  roleId: number;
}

export interface Region{
  id: number;
  title: string;
  value: string;
}

export interface RoleType{
  id: number;
  title: string;
  value: string;
}

// 添加用户

interface Values {
  title: string;
  description: string;
  modifier: string;
}
interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
  regionList: Array<Region>;
  roleIds:Array<string>;
}

const CreateUserForm: React.FC<CollectionCreateFormProps> = ({
  open,
  onCreate,
  onCancel,
  regionList,
  roleIds,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title="添加新用户"
      okText="添加"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: 'public' }}
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '输入用户名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item 
          name="password"
          label="密码"
          rules={[{ required: true, message: '输入密码' }]}>
          <Input type="password" />
        </Form.Item>
        <Form.Item 
          name="region"
          label="区域"
          rules={[{ required: true, message: '输入区域' }]}>
          <Select  options={regionList.map((item) => ({ label: item.title, value: item.value}))}></Select>
        </Form.Item>

        <Form.Item 
          name="roleId"
          label="角色"
          rules={[{ required: true, message: '输入区域' }]}>
          <Select  options={roleIds.map((item) => ({ label: item, value: item }))}></Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default function UserList() {
  const [dataSource, setDataSource] = useState(Array<User>)
  const [regionList, setRegionList] = useState(Array<Region>)
  // const [roleTypeList, setRoleTypeList] = useState(Array<>)

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/users`).then(
      res=>{
        setDataSource(res.data as Array<User>)
      }
    )
  }, [])

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/regions`).then(
      res=>{
        setRegionList(res.data as Array<Region>)
      }
    )
  }, [])
  

  const handleOnSwitch = (checked: boolean, event: any)=>{
    //TODO:
  }
  
  const columns: ColumnsType<User>=[
    {
      title:"区域",
      dataIndex:"region",
      key:"region",
      render:(region)=>{return <b>{region===""?"全球":region}</b>}
    },
    {
      title:"角色名称",
      dataIndex:"roleId",
      key:"roleId",
      // TODO: 根据role id转文字
      render:(roleId:number)=>{return <p>{RoleId2Type.get(roleId)}</p>}
    },
    {
      title:"用户名",
      dataIndex:"username",
      key:"username",
      // render:(item)=>{return <b>{item}</b>}
    },
    {
      title:"用户状态",
      dataIndex:"roleState",
      key:"roleState",
      render:(roleState:boolean,item:User)=>{ 
        return (
          <Switch checked={roleState} disabled={item.default} onChange={handleOnSwitch}/>
        )}
    },
    {
      title:"操作",
      render:(item)=>{return<div>
      </div>}
    }
  ]
  const [open, setOpen] = useState(false);

  const onCreate = (values: any) => {
    console.log('Received values of form: ', values);
    setOpen(false);
  };



  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        添加用户
      </Button>
      <CreateUserForm
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
        regionList={regionList}
        roleIds={RoleIds}
      />
      <Table dataSource={dataSource} columns={columns}></Table>
    </div>
  )
}


