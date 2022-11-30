import { Button, Form, Input, Modal, Select } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { Region, User } from "./UserList";



interface CollectionCreateFormProps {
  regionList: Array<Region>;
  roleIds:Array<string>;
  onSubmit:(user: User) => void;
  cRef:any;
  currentUserRoleId:number
}

interface OptionItemType{
  label: any, 
  value: any,
}

function UserForm(props:CollectionCreateFormProps){
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false)
  const {regionList,roleIds,onSubmit,cRef,currentUserRoleId} = props
  const [isGlobalAdmin, setIsGlobalAdmin] = useState(false)
  const [currentUser, setCurrentUser] = useState()
    // UserForm不是一个dom对象，所以没有常规的ref属性，所以构造一个current，暴露setopen方法给父组件调用
  useImperativeHandle( 
    cRef,
    () => {
      return {
        setOpen:(o:boolean)=>{setOpen(o)},
        setCurrentUser:(u:User) =>{form.setFieldsValue(u)}
      }
    },
    [],
  )

  const onCancel = ()=>{
    setOpen(false)
  }
  
  const getOperatiableRoleIds = (currentUserRoleId:number):Array<OptionItemType> =>{
    let allRoleIds = roleIds.map((item,idx) => (
      { label: item, value: idx+1}))
    if (currentUserRoleId == 1){
      return allRoleIds
    }
    return allRoleIds.filter(item=>{return !(item.value<=currentUserRoleId)})
  }
  const operatiableRoleIds = getOperatiableRoleIds(currentUserRoleId)

  return (
    <div>
    <Modal
      open={open}
      title={currentUser?"更新用户":"添加用户"}
      okText="确定"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((user) => {
            onSubmit(user);
            // form.resetFields();
            setOpen(false)
          })
          .catch((err) => {
            console.log('Validate Failed:', err);
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
          name="roleId"
          label="角色"
          rules={[{ required: true, message: '输入角色' }]}>
          <Select onChange={
            (value)=>{
              setIsGlobalAdmin(value===1)
              // 选择超级管理员后，清空区域项
              form.setFieldsValue({
                region:""
              })
            }
          } options={operatiableRoleIds}></Select>
        </Form.Item>

        <Form.Item 
          name="region"
          label="区域"
          rules={[{ required: !isGlobalAdmin, message: '输入区域' }]}>
          <Select  
            disabled={isGlobalAdmin}
            options={regionList.map((item) => (
              { label: item.title, value: item.value}
            ))}></Select>
        </Form.Item> 

      </Form>
    </Modal>
    </div>
  );
};


export default UserForm;
// export default UserForm;
