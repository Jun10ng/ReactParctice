import { Button, Modal, Popover, Switch, Table, Tag } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

export interface Right {
  id: number;
  title: string;
  key: string;
  pagepermisson: number;
  grade: number;
  children: any;
  rightId: number;
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
      axios.delete(`http://localhost:8000/rights/${item.id}`);
    } else if (item.grade === 2) {
      let ds = dataSource.slice();
      ds.forEach((val: Right, idx: number) => {
        if (val.id === item.rightId) {
          ds[idx].children = val.children.filter(
            (data: any) => data.id !== item.id
          );
        }
      });
      axios.delete(`http://localhost:8000/children/${item.id}`);
      setDataSource(ds);
    }
  };

  function handleCheck(item: Right) {
    item.pagepermisson = item.pagepermisson===1?0:1
    // console.log(item);
    if (item.grade===1){
      axios.patch(`http://localhost:8000/rights/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }else{
      axios.patch(`http://localhost:8000/children/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }
    setDataSource([...dataSource])
  }

  const columns: ColumnsType<Right> = [
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
            {/* 编辑键 */}
            <Popover
              content={
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  checked={item.pagepermisson}
                  onClick={() => {
                    handleCheck(item);
                  }}
                />
              }
              title="配置项"
              trigger={item.pagepermisson === undefined ? "" : "click"}
            >
              <Button
                disabled={item.pagepermisson === undefined}
                onClick={() => {}}
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
              />
            </Popover>
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

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={{ pageSize: 3 }}
    ></Table>
  );
}
