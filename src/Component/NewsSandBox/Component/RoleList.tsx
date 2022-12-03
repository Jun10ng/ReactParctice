import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button, Modal, Popover, Switch, Table, Tag, Tree } from "antd";
import Item from "antd/es/list/Item";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Right } from "./RightList";

export interface Role {
  id: number;
  roleName: string;
  roleType: number;
  rights: any;
}

export default function RoleList() {
  const [dataSource, setDataSource] = useState(Array<Role>);
  const [rightList, setRightList] = useState(Array<Right>)
  const [currentRight, setCurrentRight] = useState(Array<any>)
  const [currentId, setCurrentId] = useState(-1)
  const [isModalOpen, setIsModalOpen] = useState(false); //image.png控制权限modal是否展示
  
  console.log("enter role list");
  
  const columns: ColumnsType<Role> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
      key: "roleName",
      render: (text) => <Tag color="orange">{text}</Tag>,
    },
    {
      title: "角色类型",
      dataIndex: "roleType",
      key: "roleType",
      render: (text) => <Tag color="orange">{text}</Tag>,
    },
    {
      title: "操作",
      // dataIndex: 'rights',
      // key: 'rights',
      render: (item: Role) => {
        return (
          <div>
            {/* 编辑键 */}
            <Button
              onClick={() => {
                // console.log(item.rights)
                setCurrentRight(item.rights)
                showModal();
                setCurrentId(item.id)
              }}
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
            />
            {/* 删除键 */}
            <Button
              onClick={() => {
                handleOnDelete(item);
              }}
              danger
              shape="circle"
              icon={<DeleteOutlined />}
            ></Button>
          </div>
        );
      },
    },
  ];

  const { confirm } = Modal;

  useEffect(() => {
    axios.get(`/roles`).then((res) => {
      setDataSource(res.data as Array<Role>);
    });

    axios.get(`http://localhost:8000/rights?_embed=children`).then((res) => {
      setRightList(res.data as Array<Right>);
    });
  }, []);

  // console.log(dataSource)
  // console.log(rightList)

  const handleOnDelete = (item: any) => {
    setTimeout(() => {
      confirm({
        icon: <ExclamationCircleOutlined />,
        content: "请确认删除",
        onOk() {
          // console.log("ok delete",item)
          deleteMethod(item);
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    }, 500);
  };

  const deleteMethod = (item: Role) => {
    // 删除当前页面 再删除后端的
    console.log("======");
  };


  // console.log(dataSource);
  const handleOk = () => {
    // console.log("handleOk")
    setIsModalOpen(false);
    // 同步dataSource
    setDataSource(dataSource.map(item=>{
      if (item.id===currentId){
        return {
          ...item,
          rights:currentRight,
        }
      }
      return item
    }))
    // put会后端接口 
    axios.patch(`http://localhost:8000/roles/${currentId}`,{
      rights:currentRight
    })

  };
  const handleCancel = () => {
    // console.log("handleCancel")
    setIsModalOpen(false);
  };
  const showModal = () => {
    // console.log("showModal")
    setIsModalOpen(true);
  };
  const onCheck=(keys:any)=>{
    // console.log(keys)
    setCurrentRight(keys)
  }
  return (
    // <div>Role List</div>
    // columns={}
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}
        pagination={{ pageSize: 3 }}
      ></Table>

      {/* // 树形- 权限 */}
      <Modal
        title="权限分配"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree checkable 
        checkedKeys={currentRight}
        onCheck={onCheck}
        treeData={rightList} />
      </Modal>
    </div>
  );
}
