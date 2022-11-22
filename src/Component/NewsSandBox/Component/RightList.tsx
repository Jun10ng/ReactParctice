import { Button, Modal, Table, Tag } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

interface Right {
  id: number;
  title: string;
  key: string;
  pagepermisson: number;
  grade: number;
  children: any;
  rightId:number
}

export default function RightList() {
  const [dataSource, setDataSource] = useState(Array<Right>);

  useEffect(() => {
    axios.get("http://localhost:8000/rights?_embed=children").then((res) => {
      let ds: Array<Right> = res.data;
      ds.forEach((val: Right) => {
        //修复children字段为[]的时候，仍然显示展开符号的问题
        if (val.children.length == 0) {
          val.children = undefined;
        }
      });
      setDataSource(ds);
    });
  }, []);

  const { confirm } = Modal;
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
  const deleteMethod = (item: Right) => {
    // 删除当前页面 再删除后端的
    if (item.grade === 1) {
      setDataSource(dataSource.filter((data) => data.id !== item.id));
    } else if (item.grade === 2) {
      let ds = dataSource.slice(); 
      ds.forEach((val: Right,idx:number) => {
        if (val.id === item.rightId) {
          ds[idx].children = val.children.filter(
            (data: any) => data.id !== item.id
          );
        }
      });
      setDataSource(ds)

    }
  };
  // axios.delete(`http://localhost:8000/rights/${item.id}`)

  const columns: ColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id: any) => {
        return <b>{id}</b>;
      },
    },
    {
      title: "权限名称",
      dataIndex: "title",
      render: (key: any) => {
        return <Tag color="orange">{key}</Tag>;
      },
    },
    {
      title: "权限路径",
      dataIndex: "key",
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button type="primary" shape="circle" icon={<EditOutlined />} />
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
  // console.log(dataSource)
  // let ds:Array<any> = dataSource.slice()
  // console.log(ds)
  // ds[0].children = null
  // console.log(ds)
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={{ pageSize: 3 }}
    ></Table>
  );
}
